package main

import (
	"testing"
	"time"

	"github.com/magiconair/properties/assert"
)

type MockClient struct {
	send chan []byte
}

func NewMockClient() *MockClient {
	return &MockClient{
		send: make(chan []byte, 10), // buffer to avoid blocking in tests
	}
}
func TestBroadcastMessage(t *testing.T) {
	// Arrange
	room := Room{
		name:      "testRoom",
		clients:   make(map[*Client]bool),
		broadcast: make(chan []byte),
	}
	client1 := NewMockClient()
	client2 := NewMockClient()
	room.clients[&Client{send: client1.send}] = true
	room.clients[&Client{send: client2.send}] = true

	// Act
	go room.broadcastMessage([]byte("hello"))

	// Assert
	assert.Equal(t, "hello", string(<-client1.send), "Client 1 should receive the correct message")
	assert.Equal(t, "hello", string(<-client2.send), "Client 2 should receive the correct message")
}

func TestListenBroadcast(t *testing.T) {
	// Arrange
	room := Room{
		name:      "testRoom",
		clients:   make(map[*Client]bool),
		broadcast: make(chan []byte),
	}
	client1 := NewMockClient()
	room.clients[&Client{send: client1.send}] = true

	// Act
	go room.listenBroadcast()
	room.broadcast <- []byte("test message")

	// Assert
	select {
	case msg := <-client1.send:
		assert.Equal(t, "test message", string(msg), "Client should receive the broadcast message")
	case <-time.After(1 * time.Second):
		t.Fatal("Failed to receive broadcast message in time")
	}
}

func TestBroadcastMessageWithBlockingClient(t *testing.T) {
	// Arrange
	room := &Room{
		name:      "testRoom",
		clients:   make(map[*Client]bool),
		broadcast: make(chan []byte),
	}
	mockClient := NewMockClient()
	client := &Client{send: mockClient.send}
	room.clients[client] = true
	for i := 0; i < cap(mockClient.send); i++ {
		mockClient.send <- []byte("fill")
	}
	// Act
	go room.broadcastMessage([]byte("test message"))
	time.Sleep(100 * time.Millisecond)

	// Assert
	if _, exists := room.clients[client]; exists {
		t.Errorf("Blocking client should have been removed")
	}
}

func TestRoomBroadcast(t *testing.T) {
	// Arrange
	hub := newHub()
	go hub.run()
	client1 := &Client{
		send:     make(chan []byte, 256),
		roomName: "testRoom",
	}
	client2 := &Client{
		send:     make(chan []byte, 256),
		roomName: "testRoom",
	}
	hub.register <- &ClientRoomPair{client1, "testRoom"}
	hub.register <- &ClientRoomPair{client2, "testRoom"}
	time.Sleep(time.Millisecond * 10)

	// Act
	msg := []byte("hello")
	if room, ok := hub.rooms["testRoom"]; ok {
		room.broadcast <- msg
	}

	// Assert
	select {
	case receivedMsg := <-client1.send:
		if string(receivedMsg) != string(msg) {
			t.Errorf("client1 did not receive the correct message")
		}
	case <-time.After(time.Millisecond * 10):
		t.Errorf("client1 did not receive any message")
	}

	select {
	case receivedMsg := <-client2.send:
		if string(receivedMsg) != string(msg) {
			t.Errorf("client2 did not receive the correct message")
		}
	case <-time.After(time.Millisecond * 10):
		t.Errorf("client2 did not receive any message")
	}
}
