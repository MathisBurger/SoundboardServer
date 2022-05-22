package storage

import "github.com/gofiber/websocket/v2"

type PlayerProcess struct {
	PlayerId  int
	SoundName string
}

var CurrentPlayerPids []PlayerProcess
var AuthorizedConnections []*websocket.Conn
