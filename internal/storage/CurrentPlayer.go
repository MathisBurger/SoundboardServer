package storage

import "github.com/gofiber/websocket/v2"

var CurrentPlayerPid int
var AuthorizedConnections []*websocket.Conn
