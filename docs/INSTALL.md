## Install

### Prerequisites

- [Node.js](https://nodejs.org/). The required version of Node.js is documented in the `package.json`. We recommend installing a tool for managing versions of Node.js on your development machine; several of our contributors use [nvm](https://nvm.sh), though we don't specifically require it.
- [Yarn](https://yarnpkg.com/) for package management.

Steps for installing prerequisites are excluded since different developers/environments will have different preferences. Follow your system-specific instructions for each prerequisite.

### Installation

Follow these steps to set up the project on a new development machine. Instructions assume you have installed prerequisites, cloned the repository locally, and are in the root directory of the project.

1. Install packages:

    ```shell
    yarn install
    ```

2. Set up an instance of Kafka

3. Create your local configuration

    ```shell
    cp .env.template .env
    vi .env
    ```

### Setting up Kafka

This project uses Kafka. You can set up Kafka using whatever method you prefer, just configure the TV Kitchen to use your instance by populating `KAFKA_BROKERS` in `.env`.

The repository provides a Docker-based Kafka configuration as well for convenience.

Running our provided setup requires [Docker Engine](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/).  Once Docker is installed you can activate Kafka by typing `yarn kafka:start`.  You can also stop Kafka by typing `yarn kafka:stop`.

NOTE: If you are using the Dockerized Kafka, populate `KAFKA_BROKERS` in `.env` with the value `localhost:9092`.
