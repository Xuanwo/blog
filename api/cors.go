package api

import (
	"net/http"

	"github.com/rs/cors"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	cors.AllowAll().HandlerFunc(w, r)
}
