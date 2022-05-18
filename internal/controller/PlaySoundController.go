package controller

import (
	"SoundboardServer/internal/middleware"
	"SoundboardServer/internal/storage"
	"github.com/gofiber/fiber/v2"
	"os/exec"
)

type websocketUpdatedPlaying struct {
	Action      string `json:"action"`
	UpdatedName string `json:"updatedName"`
	Started     bool   `json:"started"`
}

func PlaySoundController(ctx *fiber.Ctx) error {

	if !middleware.ValidateAuth(ctx) {
		return ctx.SendStatus(401)
	}
	cmd := exec.Command("./Player", "./sounds/"+ctx.Query("soundName", ""))
	err := cmd.Start()
	if err != nil {
		return ctx.SendString(err.Error())
	}
	go func() {
		err := cmd.Wait()
		if err == nil {
			for _, conn := range storage.AuthorizedConnections {
				conn.WriteJSON(websocketUpdatedPlaying{
					Action:      "UpdatePlaying",
					UpdatedName: ctx.Query("soundName", ""),
					Started:     false,
				})
			}
		}
	}()
	storage.CurrentPlayerPid = cmd.Process.Pid
	if err == nil {
		for _, conn := range storage.AuthorizedConnections {
			conn.WriteJSON(websocketUpdatedPlaying{
				Action:      "UpdatePlaying",
				UpdatedName: ctx.Query("soundName", ""),
				Started:     true,
			})
		}
	}
	return ctx.SendStatus(200)
}
