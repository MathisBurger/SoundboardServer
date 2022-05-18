package controller

import (
	"SoundboardServer/internal/middleware"
	"SoundboardServer/internal/storage"
	"github.com/gofiber/fiber/v2"
	"os"
)

func StopSoundController(ctx *fiber.Ctx) error {

	if !middleware.ValidateAuth(ctx) {
		return ctx.SendStatus(401)
	}
	p := &os.Process{
		Pid: storage.CurrentPlayerPid,
	}
	err := p.Kill()
	if err != nil {
	}
	if err == nil {
		for _, conn := range storage.AuthorizedConnections {
			conn.WriteJSON(websocketUpdatedPlaying{
				Action:      "UpdatePlaying",
				UpdatedName: ctx.Query("soundName", ""),
				Started:     false,
			})
		}
	}
	return ctx.SendStatus(200)
}
