package main

import (
	"encoding/json"
	"net/http"
)

type Message struct {
	Text string `json:"text"`
}

func getMessage(w http.ResponseWriter, r *http.Request) {
	response := Message{Text: "Hello from Go backend!"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func postMessage(w http.ResponseWriter, r *http.Request) {
	var req Message
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(req)
}
