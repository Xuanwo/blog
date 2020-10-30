package handler

import (
	"net/http"
	"strings"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusMovedPermanently)
	w.Header().Add("Location", strings.ToLower(r.URL.String()))
}
