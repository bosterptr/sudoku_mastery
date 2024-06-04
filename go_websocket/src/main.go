package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"
)

var addr = flag.String("addr", ":5000", "http service address")

func main() {
	flag.Parse()
	rsaPub, err := loadRSAPublicKey("./cert/publickey.crt")
	if err != nil {
		log.Printf("Failed to load RSA public key: %v", err)
		return
	}
	hub := newHub()
	go hub.run()
	http.HandleFunc("/ws", func(responseWriter http.ResponseWriter, request *http.Request) {
		serveWs(hub, responseWriter, rsaPub, request)
	})
	server := &http.Server{
		Addr:              *addr,
		ReadHeaderTimeout: 3 * time.Second,
	}
	fmt.Printf("listening")
	err = server.ListenAndServe()
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
