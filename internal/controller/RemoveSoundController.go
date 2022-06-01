package controller

import (
	"SoundboardServer/internal/middleware"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"os"
)

func RemoveSoundController(ctx *fiber.Ctx) error {

	if !middleware.ValidateAuth(ctx) {
		return ctx.SendStatus(401)
	}
	soundName := ctx.Query("soundName", "")
	if soundName == "" {
		return ctx.SendStatus(400)
	}
	_, err := os.Stat(fmt.Sprintf("./sounds/%s", soundName))
	if os.IsNotExist(err) {
		return ctx.SendStatus(400)
	}
	err = os.Remove(fmt.Sprintf("./sounds/%s", soundName))
	if err != nil {
		return ctx.SendString(err.Error())
	}
	return ctx.SendStatus(200)
}
