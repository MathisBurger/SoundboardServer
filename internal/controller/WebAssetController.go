package controller

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
	"os"
)

// WebAssetController handles all webasset requests
func WebAssetController(ctx *fiber.Ctx) error {

	path := fmt.Sprintf("./webassets/%s", ctx.Path())
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		return ctx.SendFile("./webassets/404.html")
	}
	return ctx.SendFile(path)
}
