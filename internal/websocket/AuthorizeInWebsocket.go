package websocket

import (
	accessToken2 "SoundboardServer/internal/accessToken"
	"fmt"
	"github.com/gofiber/websocket/v2"
)

func AuthorizeInWebSocket(conn *websocket.Conn) bool {
	req := WebsocketRequest{}
	err := conn.ReadJSON(req)
	if err != nil {
		conn.WriteJSON(WebsocketRequest{
			"Auth",
			"Authorization with websocket failed",
		})
		return false
	}
	atvalidator, _ := accessToken2.NewJWTManager("", "./certs/public.pem")

	accessToken := fmt.Sprint(req.Content)
	_, err = atvalidator.Validate(accessToken)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}
	return true
}
