package controller

import (
	"SoundboardServer/internal/accessToken"
	"encoding/json"
	"github.com/gofiber/fiber/v2"
	"os"
	"time"
)

type loginRequest struct {
	Password string `json:"password"`
}

type loginResponse struct {
	Status    bool   `json:"status"`
	Message   string `json:"message"`
	AuthToken string `json:"auth_token"`
}

const accessTokenLifetime = 1 * time.Hour

// AuthController handles the login
// requests to the server.
func AuthController(ctx *fiber.Ctx) error {

	// parsing and checking request
	obj := loginRequest{}
	err := json.Unmarshal(ctx.Body(), &obj)

	if err != nil {
		return ctx.SendStatus(400)
	}
	if obj.Password == os.Getenv("ADMIN_PASSWORD") {
		manager, err := accessToken.NewJWTManager("./certs/private.pem", "")
		if err != nil {
			return err
		}
		token, err := manager.Generate("", accessTokenLifetime)
		if err != nil {
			return err
		}
		return ctx.JSON(loginResponse{
			true,
			"Login successful",
			token,
		})
	} else {
		return ctx.SendStatus(401)
	}
}
