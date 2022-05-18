package middleware

import (
	accessToken2 "SoundboardServer/internal/accessToken"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"strings"
)

func ValidateAuth(ctx *fiber.Ctx) bool {
	atvalidator, _ := accessToken2.NewJWTManager("", "./certs/public.pem")

	authheader := ctx.Get("Authorization")

	if !strings.HasPrefix(authheader, "accessToken ") {
		return false
	}
	accessToken := authheader[12:]
	_, err := atvalidator.Validate(accessToken)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}

	return true
}
