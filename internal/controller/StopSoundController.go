package controller

import (
	"SoundboardServer/internal/middleware"
	"SoundboardServer/internal/storage"
	"github.com/gofiber/fiber/v2"
	"os"
)

func removeProcess(slice []storage.PlayerProcess, i int) []storage.PlayerProcess {
	copy(slice[i:], slice[i+1:])
	return slice[:len(slice)-1]
}

func findIndex(slice []storage.PlayerProcess, soundName string) int {
	for i, p := range slice {
		if p.SoundName == soundName {
			return i
		}
	}
	return -1
}

func StopSound(process storage.PlayerProcess) {
	p := &os.Process{
		Pid: process.PlayerId,
	}
	err := p.Kill()
	if err != nil {
		return
	}
	storage.CurrentPlayerPids =
		removeProcess(storage.CurrentPlayerPids, findIndex(storage.CurrentPlayerPids, process.SoundName))
	if err == nil {
		for _, conn := range storage.AuthorizedConnections {
			conn.WriteJSON(websocketUpdatedPlaying{
				Action:      "UpdatePlaying",
				UpdatedName: process.SoundName,
				Started:     false,
			})
		}
	}
}

func StopSoundController(ctx *fiber.Ctx) error {

	if !middleware.ValidateAuth(ctx) {
		return ctx.SendStatus(401)
	}
	soundName := ctx.Query("soundName", "")
	for _, player := range storage.CurrentPlayerPids {
		if soundName == "" {
			StopSound(player)

		} else {
			if soundName == player.SoundName {
				StopSound(player)
				return ctx.SendStatus(200)
			}
		}
	}

	return ctx.SendStatus(200)
}
