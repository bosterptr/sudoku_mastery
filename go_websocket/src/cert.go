package main

import (
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"log"
	"os"
)

func loadRSAPublicKey(path string) (*rsa.PublicKey, error) {
	keyData, err := os.ReadFile(path)
	if err != nil {
		log.Fatalf("Failed to read file: %s", err)
	}
	if err != nil {
		return nil, err
	}
	block, _ := pem.Decode(keyData)
	if block == nil {
		return nil, fmt.Errorf("public key error: no key found")
	}
	pub, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		return nil, err
	}
	switch pub := pub.(type) {
	case *rsa.PublicKey:
		return pub, nil
	default:
		return nil, fmt.Errorf("public key error: not RSA public key")
	}
}
