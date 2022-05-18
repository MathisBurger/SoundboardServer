package main

import (
	"SoundboardServer/internal/controller"
	"SoundboardServer/internal/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/websocket/v2"
	"os"
	"time"
)

func main() {

	utils.GenerateKeys()

	app := fiber.New()

	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
		ExposeHeaders:    "Authorization",
	}))

	if os.Getenv("RATE_LIMITER") == "enabled" {
		app.Use(limiter.New(limiter.Config{
			Next: func(c *fiber.Ctx) bool {
				return c.IP() == "127.0.0.1"
			},
			Max:        20,
			Expiration: 10 * time.Second,
			KeyGenerator: func(ctx *fiber.Ctx) string {
				return ctx.Get("x-forwarded-for")
			},
			LimitReached: func(ctx *fiber.Ctx) error {
				return ctx.SendStatus(fiber.StatusTooManyRequests)
			},
		}))
	}
	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Post("/api/auth/login", controller.AuthController)
	app.Get("/api/player/playSound", controller.PlaySoundController)
	app.Get("/api/player/stopSound", controller.StopSoundController)
	app.Get("/ws", websocket.New(controller.WebSocketController))
	app.Get("/api/sounds", controller.SoundsController)

	err := app.Listen(":8080")
	if err != nil {
		panic(err.Error())
	}
}
