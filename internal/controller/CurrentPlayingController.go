package controller

import (
	"SoundboardServer/internal/middleware"
	"SoundboardServer/internal/storage"
	"github.com/gofiber/fiber/v2"
)

type response struct {
	Sounds []string `json:"sounds"`
}

func CurrentPlayingController(ctx *fiber.Ctx) error {

	if !middleware.ValidateAuth(ctx) {
		return ctx.SendStatus(401)
	}

	var playing []string

	for _, el := range storage.CurrentPlayerPids {
		playing = append(playing, el.SoundName)
	}
	return ctx.JSON(response{
		Sounds: playing,
	})
}
