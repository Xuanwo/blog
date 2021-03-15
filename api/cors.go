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
	// Trick for gitalk.
	r.Header.Add("Access-Control-Request-Method", "GET, POST")

	rp := httputil.ReverseProxy{
		Director: func(req *http.Request) {
			req.URL.Scheme = GithubUrl.Scheme
			req.URL.Host = GithubUrl.Host
			req.URL.Path = GithubUrl.Path
			req.URL.RawPath = GithubUrl.RawPath
			if _, ok := req.Header["User-Agent"]; !ok {
				// explicitly disable User-Agent so it's not set to default value
				req.Header.Set("User-Agent", "")
			}
		},
		ModifyResponse: func(response *http.Response) error {
			if response.StatusCode == http.StatusMovedPermanently {
				response.Header.Set("Location", "/api/cors/")
			}
			return nil
		},
	}

	c := cors.AllowAll()
	c.Log = log.New(os.Stderr, "[cors] ", log.LstdFlags)

	c.Handler(&rp).ServeHTTP(w, r)
}
