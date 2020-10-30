package handler

import (
	"net/http"
	"strings"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusPermanentRedirect)
	w.Header().Add("Location", strings.ToLower(r.URL.String()))
}
