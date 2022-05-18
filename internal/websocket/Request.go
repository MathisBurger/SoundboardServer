package websocket

type WebsocketRequest struct {
	Action  string      `json:"action"`
	Content interface{} `json:"content"`
}
