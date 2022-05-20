package websocket

import (
	accessToken2 "SoundboardServer/internal/accessToken"
	"github.com/gofiber/websocket/v2"
)

func AuthorizeInWebSocket(conn *websocket.Conn) bool {
	_, msg, err := conn.ReadMessage()
	if err != nil {
		conn.WriteJSON(WebsocketRequest{
			"Auth",
			"Authorization with websocket failed",
		})
		return false
	}
	atvalidator, _ := accessToken2.NewJWTManager("", "./certs/public.pem")

	accessToken := string(msg)
	_, err = atvalidator.Validate(accessToken)
	if err != nil {
		return false
	}
	return true
}
