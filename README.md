[![Build Status](https://travis-ci.org/tvkitchen/tv-kitchen.svg?branch=master)](https://travis-ci.org/tvkitchen/tv-kitchen)

# TV Kitchen

The [TV Kitchen](https://tv.kitchen) is a playground that turns TV into data (transcripts, facial recognition, etc.) so that newsrooms can help their staff and readers better understand what is happening across various local and cable TV news outlets.

## Setting up the project

If you are interested in running the TV Kitchen as a developer please review our [install instructions](docs/INSTALL.md).

If you are interested in running the TV Kitchen as a user please visit [our website](https://tv.kitchen).

## Starting the project

1. If you are not already running your own instance of Kafka, start Kafka:

```shell
yarn kafka:start
```

2. Start the kitchen itself

```shell
yarn start
```

## Project Structure

To understand the overall architecture of the project, please review our [architecture documentation](docs/ARCHITECTURE.md).

The root structure is as follows:

```
- docs     // Project documentation
- services // Convenience containers for various external services (e.g. Kafka)
- src      // The primary code location itself
| - components // Architectural components
| - constants  // Constants used throughout the project
| - lib        // Supporting code (e.g. utilities, DB singletons, etc)
| - scripts    // Supporting scripts
| - tests      // System-wide / integration tests
```

## Participating

TV Kitchen is an open source project, and we welcome contributions of any kind.

Thank you for considering, and before diving in please follow these steps:

* **Step 1:** read our [code of conduct](docs/CODE_OF_CONDUCT.md).
* **Step 2:** review our [contribution guide](docs/CONTRIBUTING.md).
* **Step 3:** make sure your contribution is [related to an issue](https://github.com/tvkitchen/tv-kitchen/issues).
* **Step 4:** review these [testing best practices](https://github.com/goldbergyoni/javascript-testing-best-practices).
