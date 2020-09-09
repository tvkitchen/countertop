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


### Setting up Kafka

This project uses Kafka. You can set up Kafka using whatever method you prefer, just configure the TV Kitchen to use your instance by populating `kafkaSettings` when constructing a `Countertop` instance.


```
import Countertop from `@tvkitchen/countertop`
const countertop = new Countertop({
	kafkaSettings: {
		brokers: ['127.0.0.1:9092']
	}
})
```
