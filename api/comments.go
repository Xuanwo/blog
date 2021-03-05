// Code is inspired by:
//   - https://github.com/utterance/utterances-oauth
//   - https://github.com/GizmoOAO/utterances-oauth.go
package api

import (
	"context"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
)

var (
	log    *zap.Logger
	config *oauth2.Config

	commentSrv *commentService
)

const (
	UtterancesBotToken      = "UTTERANCES_BOT_TOKEN"
	UtterancesClientID      = "UTTERANCES_CLIENT_ID"
	UtterancesClientSecret  = "UTTERANCES_CLIENT_SECRET"
	UtterancesStatePassword = "UTTERANCES_STATE_PASSWORD"
	UtterancesOrigins       = "UTTERANCES_ORIGINS"

	HeaderAuthorization = "Authorization"
	HeaderUserAgent     = "User-Agent"
)

type commentService struct {
	*gin.Engine

	botToken      string
	clientId      string
	statePassword string

	cipher cipher.AEAD
}

func Comments(w http.ResponseWriter, r *http.Request) {
	commentSrv.ServeHTTP(w, r)
}

func newCommentService() *commentService {
	cs := &commentService{
		Engine: gin.Default(),

		botToken:      os.Getenv(UtterancesBotToken),
		clientId:      os.Getenv(UtterancesClientID),
		statePassword: os.Getenv(UtterancesStatePassword),
	}

	// Init cipher
	block, err := aes.NewCipher([]byte(cs.statePassword))
	if err != nil {
		panic(err.Error())
	}
	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		panic(err.Error())
	}
	cs.cipher = aesgcm

	// Register API
	cs.register()
	return cs
}

func (cs *commentService) register() {
	// Handle cors
	//
	// Config is borrowed from https://github.com/utterance/utterances-oauth
	cs.Use(cors.New(cors.Config{
		AllowOrigins: strings.Split(os.Getenv(UtterancesOrigins), ","),
		AllowMethods: []string{"GET", "POST", "OPTIONS"},
		AllowHeaders: []string{
			"X-Requested-With",
			"X-HTTP-Method-Override",
			"Content-Type",
			"Accept",
			"Authorization",
			"label",
		},
		AllowCredentials: true,
		MaxAge:           86400,
	}))

	csg := cs.Group("/api/comments")

	csg.OPTIONS("", handleOptions)
	csg.GET("/authorize", cs.handleAuthorize)
	csg.GET("/authorized", cs.handleAuthorized)
	csg.POST("/token", handleToken)
	csg.POST("/repos/:repo/issues", cs.handleIssues)
}

func handleOptions(c *gin.Context) {
	c.Status(200)
}

func (cs *commentService) handleAuthorize(c *gin.Context) {
	var query struct {
		RedirectUri string `form:"redirect_uri" binding:"required"`
	}
	if err := c.ShouldBindQuery(&query); err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}

	state, err := cs.EncryptState(query.RedirectUri)
	if err != nil {
		c.String(http.StatusInternalServerError, err.Error())
		return
	}

	c.Redirect(http.StatusFound, AuthURL(state))
}

func (cs *commentService) handleAuthorized(c *gin.Context) {
	var query struct {
		Code  string `form:"code" binding:"required"`
		State string `form:"state" binding:"required"`
	}
	if err := c.ShouldBindQuery(&query); err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}

	state, err := cs.DecryptState(query.State)
	if err != nil {
		c.String(http.StatusBadRequest, `"state" is invalid`)
		return
	} else if time.Now().Unix() > state.Expires {
		c.String(http.StatusBadRequest, `"state" is expired`)
		return
	}

	ctx := context.Background()
	token, err := AccessToken(ctx, query.Code)
	if err != nil {
		c.String(http.StatusServiceUnavailable, "unable to load token from GitHub")
		return
	}

	u, err := url.Parse(state.Value)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	u.Query().Set("utterances", token.AccessToken)

	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie("token", url.QueryEscape(token.AccessToken), int(state.Expires), "/token", "", true, true)

	c.Redirect(http.StatusFound, u.String())
}

func handleToken(c *gin.Context) {
	token, err := c.Cookie("token")
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}

	c.String(http.StatusOK, token)
}

func (cs *commentService) handleIssues(c *gin.Context) {
	auth := strings.Fields(c.Request.Header.Get(HeaderAuthorization))
	if len(auth) != 2 {
		c.Header("Content-Type", "text/plain")
		c.String(400, `"Authorization" header is required`)
		return
	}

	// Check user auth on github.
	ctx := context.Background()
	client := Client(ctx, auth[1])

	resp, err := client.Get("https://api.github.com/user")
	if err != nil {
		return
	}
	if resp.StatusCode != http.StatusOK {
		c.Status(401)
		return
	}

	resp, err = client.Post(fmt.Sprintf("https://api.github.com%s", c.Request.URL.Path), "application/json",
		c.Request.Body)
	if err != nil {
		c.Status(503)
		return
	}
	defer resp.Body.Close()

	_, err = io.Copy(c.Writer, resp.Body)
	if err != nil {
		c.Status(503)
		return
	}

	for k, v := range resp.Header {
		c.Header(k, v[0])
	}
	c.Status(resp.StatusCode)
}

func (cs *commentService) encrypt(content string) (string, error) {
	nonce := make([]byte, 12)
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	ciphertext := cs.cipher.Seal(nil, nonce, []byte(content), nil)
	return hex.EncodeToString(nonce) + base64.StdEncoding.EncodeToString(ciphertext), nil
}

func (cs *commentService) decrypt(content string) (string, error) {
	nonce, err := hex.DecodeString(content[:24])
	if err != nil {
		return "", err
	}
	ciphertext, err := base64.StdEncoding.DecodeString(content[24:])
	if err != nil {
		return "", err
	}
	plaintext, err := cs.cipher.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", err
	}
	return string(plaintext), nil
}

const validityPeriod = time.Minute * 5

type State struct {
	Value   string `json:"value"`
	Expires int64  `json:"expires"`
}

func (cs *commentService) EncryptState(value string) (string, error) {
	state := State{Value: value, Expires: time.Now().Add(validityPeriod).Unix()}
	jsonData, err := json.Marshal(state)
	if err != nil {
		return "", err
	}
	return cs.encrypt(string(jsonData))
}

func (cs *commentService) DecryptState(value string) (state State, err error) {
	data, err := cs.decrypt(value)
	if err != nil {
		return State{}, err
	}

	if err = json.Unmarshal([]byte(data), &state); err != nil {
		return State{}, err
	}
	return state, nil
}

func init() {
	log, _ = zap.NewProduction()
	config = &oauth2.Config{
		ClientID:     os.Getenv(UtterancesClientID),
		ClientSecret: os.Getenv(UtterancesClientSecret),
		Endpoint:     github.Endpoint,
	}

	commentSrv = newCommentService()
}

func AuthURL(state string) string {
	return config.AuthCodeURL(state)
}

func AccessToken(ctx context.Context, code string) (token *oauth2.Token, err error) {
	return config.Exchange(ctx, code)
}

func Client(ctx context.Context, accessToken string) *http.Client {
	return config.Client(ctx, &oauth2.Token{
		AccessToken: accessToken,
		TokenType:   "Bearer",
	})
}
