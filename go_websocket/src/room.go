package main

import "log"

type Room struct {
	name      string
	clients   map[*Client]bool
	broadcast chan []byte
}

func (r *Room) broadcastMessage(message []byte) {
	for client := range r.clients {
		select {
		case client.send <- message:
		default:
			close(client.send)
			delete(r.clients, client)
		}
	}
}

func (r *Room) listenBroadcast() {
	for message := range r.broadcast {
		log.Print(string(message[:]))
		r.broadcastMessage(message)
	}
}
