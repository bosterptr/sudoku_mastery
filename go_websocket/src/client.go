package main

import (
	"bytes"
	"crypto/rsa"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 512
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Operation int

const (
	OpConnected Operation = iota
	OpDisconnected
	OpMove
)

type Message struct {
	UserId  string    `json:"userId"`
	Op      Operation `json:"op"`
	Payload string    `json:"p"`
}

type Client struct {
	UserId   string
	hub      *Hub
	conn     *websocket.Conn
	send     chan []byte
	roomName string
}

func (c *Client) readPump() {
	defer func() {
		c.hub.unregister <- &ClientRoomPair{c, c.roomName}
		c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	if err := c.conn.SetReadDeadline(time.Now().Add(pongWait)); err != nil {
		log.Printf("Error setting connection property: %v", err)
		return
	}
	c.conn.SetPongHandler(func(string) error {
		if err := c.conn.SetReadDeadline(time.Now().Add(pongWait)); err != nil {
			log.Printf("Error setting pong handler: %v", err)
			return nil
		}
		return nil
	})

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1))
		var msg Message
		if err := json.Unmarshal(message, &msg); err != nil {
			log.Fatalf("Error parsing JSON: %s", err)
		}
		if msg.Payload == "" {
			log.Println("Received an empty message")
		} else {
			log.Printf("Operation: %d, Broadcasting message: %s\n", msg.Op, msg.Payload)
		}

		switch msg.Op {
		case OpMove:
			c.hub.rooms[c.roomName].broadcast <- message
		default:
			log.Printf("Ignoring operation %d for message: %s\n", msg.Op, msg.Payload)
		}
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			if err := c.conn.SetReadDeadline(time.Now().Add(writeWait)); err != nil {
				log.Printf("Error setting connection property: %v", err)
				return
			}
			if !ok {
				if err := c.conn.WriteMessage(websocket.CloseMessage, []byte{}); err != nil {
					log.Printf("Error writing message: %v", err)
					return
				}
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			if _, err = w.Write(message); err != nil {
				log.Printf("Error writing message: %v", err)
				return
			}

			n := len(c.send)
			for i := 0; i < n; i++ {
				if _, err := w.Write(newline); err != nil {
					log.Printf("Error writing message: %v", err)
					return
				}
				if _, err = w.Write(<-c.send); err != nil {
					log.Printf("Error writing message: %v", err)
					return
				}
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			if err := c.conn.SetWriteDeadline(time.Now().Add(writeWait)); err != nil {
				log.Printf("Error setting connection property: %v", err)
				return
			}
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				log.Printf("Error writing close message: %v", err)
				return
			}
		}
	}
}

func serveWs(hub *Hub, responseWriter http.ResponseWriter, rsaPub *rsa.PublicKey, request *http.Request) {
	accessToken, err := getAccessToken(responseWriter, request)
	if err != nil {
		http.Error(responseWriter, "You need to pass bearer token", http.StatusUnauthorized)
	}
	claims, err := validateToken(accessToken, rsaPub)
	if err != nil {
		http.Error(responseWriter, "Invalid token", http.StatusUnauthorized)
	}
	sub, err := claims.GetSubject()
	if err != nil {
		http.Error(responseWriter, "Invalid token", http.StatusUnauthorized)
	}
	roomName := request.URL.Query().Get("room")
	if roomName == "" {
		http.Error(responseWriter, "Room name is required", http.StatusBadRequest)
		return
	}
	conn, err := upgrader.Upgrade(responseWriter, request, nil)
	if err != nil {
		log.Println(err)
		return
	}
	client := &Client{UserId: sub, hub: hub, conn: conn, send: make(chan []byte, 256), roomName: roomName}
	hub.register <- &ClientRoomPair{client, roomName}

	go client.writePump()
	go client.readPump()
}
