package main

import (
	"encoding/json"
	"log"
)

type ClientRoomPair struct {
	client   *Client
	roomName string
}

type Hub struct {
	rooms      map[string]*Room
	register   chan *ClientRoomPair
	unregister chan *ClientRoomPair
}

func newHub() *Hub {
	return &Hub{
		rooms:      make(map[string]*Room),
		register:   make(chan *ClientRoomPair),
		unregister: make(chan *ClientRoomPair),
	}
}

func (h *Hub) run() {
	for {
		select {
		case pair := <-h.register:
			log.Printf(pair.roomName)
			room, exists := h.rooms[pair.roomName]
			if !exists {
				room = &Room{
					name:      pair.roomName,
					clients:   make(map[*Client]bool),
					broadcast: make(chan []byte),
				}
				h.rooms[pair.roomName] = room
				go room.listenBroadcast()
			}
			msgBytes, err := json.Marshal(Message{UserId: pair.client.UserId, Op: OpConnected, Payload: ""})
			if err != nil {
				log.Println("Error serializing JSON:", err)
				return
			}
			room.broadcastMessage(msgBytes)
			room.clients[pair.client] = true
			pair.client.roomName = pair.roomName

		case pair := <-h.unregister:
			room := h.rooms[pair.roomName]
			if room != nil {
				delete(room.clients, pair.client)
				if len(room.clients) == 0 {
					delete(h.rooms, room.name)
				}
				close(pair.client.send)
			}
		}
	}
}
