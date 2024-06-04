package main

import (
	"crypto/rsa"
	"fmt"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

func getAccessToken(responseWriter http.ResponseWriter, request *http.Request) (string, error) {
	authHeader := request.Header.Get("Authorization")
	if authHeader == "" {
		return "", fmt.Errorf("Authorization header is required")
	}

	bearerToken := strings.Split(authHeader, " ")
	if len(bearerToken) != 2 || bearerToken[0] != "Bearer" {
		return "", fmt.Errorf("Authorization header must be in the format 'Bearer {token}'")
	}
	return bearerToken[1], nil
}
func validateToken(tokenString string, rsaPub *rsa.PublicKey) (jwt.MapClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return rsaPub, nil
	})
	if err != nil {
		return nil, err
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		if _, ok := claims["sub"].(string); !ok {
			return nil, fmt.Errorf("Missing 'sub' claim")
		}
		if _, ok := claims["exp"].(float64); !ok {
			return nil, fmt.Errorf("Missing 'exp' claim")
		}
		if _, ok := claims["jti"].(string); !ok {
			return nil, fmt.Errorf("Missing 'jti' claim")
		}
		return claims, nil
	}
	return nil, fmt.Errorf("invalid token claims or token is not valid")
}
