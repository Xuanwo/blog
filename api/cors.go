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
	rp := httputil.ReverseProxy{
		Director: func(req *http.Request) {
			req.URL.Scheme = GithubUrl.Scheme
			req.URL.Host = GithubUrl.Host
			req.URL.Path, req.URL.RawPath = GithubUrl.Path, GithubUrl.RawPath
			if _, ok := req.Header["User-Agent"]; !ok {
				// explicitly disable User-Agent so it's not set to default value
				req.Header.Set("User-Agent", "")
			}
		},
	}
	rp.ServeHTTP(w, r)

	c := cors.AllowAll()
	c.Log = log.New(os.Stderr, "[cors]", log.LstdFlags)
	c.HandlerFunc(w, r)
}
