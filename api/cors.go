package api

import (
	"log"
	"net/http"
	"os"

	"github.com/rs/cors"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	c := cors.AllowAll()
	c.Log = log.New(os.Stderr, "[cors]", log.LstdFlags)

	c.HandlerFunc(w, r)
}
