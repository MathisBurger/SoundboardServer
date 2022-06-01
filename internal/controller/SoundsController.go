package controller

import (
	"SoundboardServer/internal/middleware"
	"github.com/gofiber/fiber/v2"
	"os"
)

type soundsResponse struct {
	Sounds []string `json:"sounds"`
}

// SoundsController gets all sounds that can
// be played via the soundboard
func SoundsController(ctx *fiber.Ctx) error {

	if !middleware.ValidateAuth(ctx) {
		return ctx.SendStatus(401)
	}

	dir, err := os.ReadDir("./sounds")
	if err != nil {
		return ctx.SendString(err.Error())
	}
	var sounds []string
	for _, sound := range dir {
		sounds = append(sounds, sound.Name())
	}
	return ctx.JSON(soundsResponse{
		Sounds: sounds,
	})
}
