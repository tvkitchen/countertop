![lint](https://github.com/tvkitchen/base/actions/workflows/lint.yml/badge.svg)
![test](https://github.com/tvkitchen/base/actions/workflows/test.yml/badge.svg)
[![codecov](https://codecov.io/gh/tvkitchen/countertop/branch/main/graph/badge.svg?token=WAbcqJJL9g)](https://codecov.io/gh/tvkitchen/countertop)

# TV Kitchen Countertop

The [TV Kitchen](https://tv.kitchen) is a playground that turns TV into data (transcripts, facial recognition, etc.) so that newsrooms can help their staff and readers better understand what is happening across various local and cable TV news outlets.

The Countertop is the entry point for developers who want to set up a TV Kitchen.

## Setting up the project

If you are interested in running a copy of the TV Kitchen please review our [install instructions](docs/INSTALL.md).

If you are interested in working with TV Kitchen data please visit [our website](https://tv.kitchen).

## Starting the project

The TV Kitchen Countertop cannot yet be started directly via command line, but running a copy only involves a few lines of code:

```
import { Countertop } from '@tvkitchen/countertop'
import { VideoFileIngestionAppliance } from '@tvkitchen/appliance-video-file-ingestion'
const countertop = new Countertop()
countertop.addAppliance(new VideoFileIngestionAppliance({ filePath: 'video.mp4' }))
countertop.start()
```

Granted, this example won't do very much yet, but as you add appliances and event listeners you can start to extract data from your videos and do interesting things with that data!

You can look at the [cookbook](https://github.com/tvkitchen/cookbook) for various working examples of countertops.

## Project Structure

To understand the overall architecture of the project, please review our [architecture documentation](docs/ARCHITECTURE.md).

The root structure is as follows:

```
- docs     // Project documentation
- services // Convenience containers for various external services (e.g. Kafka)
- src      // The primary code location itself
| - classes   // Various Countertop elements
| - tools     // Supporting code (e.g. utilities, DB singletons, etc)
| - scripts   // Supporting scripts
| - tests     // System-wide / integration tests
```

## Participating

TV Kitchen is an open source project, and we welcome contributions of any kind.

Thank you for considering, and before diving in please follow these steps:

* **Step 1:** read our [code of conduct](docs/CODE_OF_CONDUCT.md).
* **Step 2:** review our [contribution guide](docs/CONTRIBUTING.md).
* **Step 3:** make sure your contribution is [related to an issue](https://github.com/tvkitchen/tv-kitchen/issues).
* **Step 4:** review these [testing best practices](https://github.com/goldbergyoni/javascript-testing-best-practices).
