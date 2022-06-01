package controller

import (
	"SoundboardServer/internal/middleware"
	"fmt"
	"github.com/gofiber/fiber/v2"
)

// AddSoundController handles all requests
// that are adding a new sound to the soundboard
func AddSoundController(ctx *fiber.Ctx) error {

	if !middleware.ValidateAuth(ctx) {
		return ctx.SendStatus(401)
	}

	file, err := ctx.FormFile("file")
	if err != nil {
		return ctx.SendString(err.Error())
	}
	err = ctx.SaveFile(file, fmt.Sprintf("./sounds/%s", file.Filename))
	if err != nil {
		return ctx.SendString(err.Error())
	}
	return ctx.SendStatus(200)
}
