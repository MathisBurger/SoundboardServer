package controller

import (
	"SoundboardServer/internal/middleware"
	"github.com/gofiber/fiber/v2"
)

// CheckLoginController if the user is authorized
// correctly and the JWT is valid
func CheckLoginController(ctx *fiber.Ctx) error {

	if middleware.ValidateAuth(ctx) {
		return ctx.SendStatus(200)
	}
	return ctx.SendStatus(401)
}
