# SudokuMastery

Sudokumastery is a project that was created after a conversation with a friend to show what problems are created by microservices architecture and to play around with creating an AI model for reading and solving sudoku. This project deserves a cleanup and more extensive testing, but due to a lack of time, this is unlikely to happen.

![AI](./solving.gif)

## Modules

| Module |  Description | 
| ---|---|
| auth_service | self explanatory.|
| cert | certs for JWT and for nginx.|
| eventbus | A directory containing all clients and protobuf schemas.|
| frontend_react | frontend built with reactjs, Wasm, Webworkers, Tensorflow, and WebGL.|
| go_websocket | A microservice created for coop and competition.|
| mailer | A microservice listening for events in Kafka that sends emails related to registration, acceptance of new devices to the account, etc.|
| neural_network_trainer | The module in which the model was created and in which it was trained on the basis of real photos (as I have found out, the creation of good synthetic datasets is not so easy, since the world is not perfect).|
| persistence | location where, when using Docker, files are saved from Kafka, Redis, and PostgreSQL databases.|
| sudoku_service | A microservice that handles sudoku creation, their listing, etc.|
| sudoku_wasm | Wasm module that accepts a white-black image processed in WebGL. It finds the sudoku mesh in that image, processes the image, projects it, cuts it out, and returns that to the AI model. Also responsible for solving sudoku (this comes in handy for checking whether a given sudoku is solvable, so that users can't save unsolvable sudokus).|
| terraform | Terraform configuration produced by Kops. I had a plan to set up a K8S cluster, but this project is unlikely to need it.|
| envs | used in the docker-compose file.|


## Prerequisites

You'll need to install:

- [Docker](https://docs.docker.com/get-docker/)

## How to build it

```bash
docker-compose up -d
```

The auth_service sometimes needs a kick after a start. Don't be afraid to reset it; it probably has a problem with Kafka not having a health check. This will hang in TODO until it's forever forgotten.
