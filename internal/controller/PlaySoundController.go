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

// PlaySoundController plays the sound with the provided filename
// and sends the player change to the websocket
func PlaySoundController(ctx *fiber.Ctx) error {

	if !middleware.ValidateAuth(ctx) {
		return ctx.SendStatus(401)
	}
	soundName := ctx.Query("soundName", "")
	cmd := exec.Command("./Player", "./sounds/"+soundName)
	err := cmd.Start()
	if err != nil {
		return ctx.SendString(err.Error())
	}
	process := storage.PlayerProcess{
		PlayerId:  cmd.Process.Pid,
		SoundName: soundName,
	}
	storage.CurrentPlayerPids = append(storage.CurrentPlayerPids, process)
	go func() {
		err := cmd.Wait()
		StopSound(process)
		if err == nil {
			for _, conn := range storage.AuthorizedConnections {
				conn.WriteJSON(websocketUpdatedPlaying{
					Action:      "UpdatePlaying",
					UpdatedName: soundName,
					Started:     false,
				})
			}
		}
	}()
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
