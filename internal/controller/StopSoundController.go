package controller

import (
	"SoundboardServer/internal/middleware"
	"SoundboardServer/internal/storage"
	"github.com/gofiber/fiber/v2"
	"os"
)

// removes the process with a specific index
// from the given slice
func removeProcess(slice []storage.PlayerProcess, i int) []storage.PlayerProcess {
	copy(slice[i:], slice[i+1:])
	return slice[:len(slice)-1]
}

// finds the index of a specific sound
// that is currently played
func findIndex(slice []storage.PlayerProcess, soundName string) int {
	for i, p := range slice {
		if p.SoundName == soundName {
			return i
		}
	}
	return -1
}

// StopSound stops the sound that is played by
// by the provided process
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

// StopSoundController stops the sound with the provided
// soundName. If the soundName is empty, all sounds are stopped
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
