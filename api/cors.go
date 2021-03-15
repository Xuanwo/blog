package api

import (
	"context"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"

	"github.com/rs/cors"
)

var (
	GithubUrl, _ = url.Parse("https://github.com/login/oauth/access_token")
)

func Handler(w http.ResponseWriter, r *http.Request) {
	proxy := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		r = r.Clone(context.Background())

		// Replace to github.com
		r.URL.Scheme = GithubUrl.Scheme
		r.URL.Host = GithubUrl.Host
		r.URL.Path = GithubUrl.Path
		r.URL.RawPath = GithubUrl.RawPath
		// Also update host to make sure request sent correctly.
		r.Host = GithubUrl.Host
		r.Header.Set("Host", GithubUrl.Host)

		resp, err := http.DefaultClient.Do(r)
		if err != nil {
			w.WriteHeader(http.StatusBadGateway)
			return
		}
		defer resp.Body.Close()

		for key, value := range resp.Header {
			for _, v := range value {
				w.Header().Add(key, v)
			}
		}
		w.WriteHeader(resp.StatusCode)

		_, err = io.Copy(w, resp.Body)
		if err != nil {
			w.WriteHeader(http.StatusBadGateway)
			return
		}
	})

	c := cors.AllowAll()
	c.Log = log.New(os.Stderr, "[cors] ", log.LstdFlags)
	c.Handler(proxy).ServeHTTP(w, r)
}
