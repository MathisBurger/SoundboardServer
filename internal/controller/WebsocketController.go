package controller

import (
	"SoundboardServer/internal/storage"
	websocket2 "SoundboardServer/internal/websocket"
	"fmt"
	"github.com/gofiber/websocket/v2"
)

// WebSocketController handles incoming websocket
// connections, checks if they are authorized and then
// writes the authorized connections into the auth array
func WebSocketController(conn *websocket.Conn) {
	if !websocket2.AuthorizeInWebSocket(conn) {
		conn.Close()
		return
	}
	storage.AuthorizedConnections = append(storage.AuthorizedConnections, conn)
	fmt.Println(len(storage.AuthorizedConnections))
	for {
		// Keep connection open
	}
}
