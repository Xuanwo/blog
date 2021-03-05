package api

import (
	"context"
	"net/http"
	"os"

	"go.uber.org/zap"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
)

var (
	log    *zap.Logger
	config *oauth2.Config

	commentSrv *commentService
)

func init() {
	log, _ = zap.NewProduction()
	config = &oauth2.Config{
		ClientID:     os.Getenv("CLIENT_ID"),
		ClientSecret: os.Getenv("CLIENT_SECRET"),
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
