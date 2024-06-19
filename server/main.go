package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/nikhil/golang-react-todo/router"
	"github.com/rs/cors"
)

func main(){
	r := router.Router()
	corsMiddleware := cors.New(cors.Options{
        AllowedOrigins: []string{"http://localhost:3000"}, // Allow requests from frontend
        AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
        AllowedHeaders: []string{"Content-Type"},
        Debug:          true, // Enable debugging to see CORS logs
    })
    r.Use(corsMiddleware.Handler)

	fmt.Println("starting the server on port 9000...")

	log.Fatal(http.ListenAndServe(":9000", r))
}