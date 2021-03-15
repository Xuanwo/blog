package api

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"

	"github.com/rs/cors"
)

var (
	GithubUrl, _ = url.Parse("https://github.com/login/oauth/access_token")
)

func Handler(w http.ResponseWriter, r *http.Request) {
	httputil.NewSingleHostReverseProxy(GithubUrl).ServeHTTP(w, r)

	c := cors.AllowAll()
	c.Log = log.New(os.Stderr, "[cors]", log.LstdFlags)
	c.HandlerFunc(w, r)
}
