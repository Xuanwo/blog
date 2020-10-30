package handler

import (
	"net/http"
	"strings"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	url := r.URL.String()
	url = strings.ToLower(url)
	if !strings.HasSuffix(url, "/") {
		url += "/"
	}

	// If url changed, we should redirect this request.
	if url != r.URL.String() {
		w.WriteHeader(http.StatusMovedPermanently)
		w.Header().Add("Location", strings.ToLower(url))
	}
}
