package storage

import "github.com/gofiber/websocket/v2"

// PlayerProcess is a struct
// that contains information about
// the playing process
type PlayerProcess struct {
	PlayerId  int
	SoundName string
}

var CurrentPlayerPids []PlayerProcess
var AuthorizedConnections []*websocket.Conn
