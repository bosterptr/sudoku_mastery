package main

import (
	"testing"
	"time"
)

func TestHubRun(t *testing.T) {
	// Arrange
	hub := newHub()
	go hub.run()
	client := &Client{send: make(chan []byte, 256)}
	roomName := "testRoom"

	// Act
	hub.register <- &ClientRoomPair{client: client, roomName: roomName}
	time.Sleep(100 * time.Millisecond)

	// Assert
	room, exists := hub.rooms[roomName]
	if !exists || room == nil {
		t.Fatalf("Room was not created")
	}
	if !room.clients[client] {
		t.Fatalf("Client was not added to the room")
	}

	// Act
	hub.unregister <- &ClientRoomPair{client: client, roomName: roomName}
	time.Sleep(100 * time.Millisecond)

	// Assert
	if _, exists := room.clients[client]; exists {
		t.Fatalf("Client was not removed from the room")
	}

	// check if the room is cleaned up after the client is removed
	if len(room.clients) == 0 {
		if _, exists := hub.rooms[roomName]; exists {
			t.Fatalf("Room was not removed after last client unregistered")
		}
	}
}
