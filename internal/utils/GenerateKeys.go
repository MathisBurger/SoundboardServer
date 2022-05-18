package utils

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"io/ioutil"
	"os"
)

func GenerateKeys() {
	if _, err := os.Stat("./certs/private.pem"); os.IsNotExist(err) {
		privKey, _ := rsa.GenerateKey(rand.Reader, 2048)
		privBytes := pem.EncodeToMemory(
			&pem.Block{
				Type:  "RSA PRIVATE KEY",
				Bytes: x509.MarshalPKCS1PrivateKey(privKey),
			},
		)
		ioutil.WriteFile("./certs/private.pem", privBytes, 0644)

		public := &privKey.PublicKey

		pubASN1, _ := x509.MarshalPKIXPublicKey(public)
		pubBytes := pem.EncodeToMemory(&pem.Block{
			Type:  "RSA PUBLIC KEY",
			Bytes: pubASN1,
		})
		ioutil.WriteFile("./certs/public.pem", pubBytes, 0644)
	}
}
