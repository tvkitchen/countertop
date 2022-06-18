# Changelog for @tvkitchen/countertop

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- The `Payload` class is now part of the countertop.  This will replace the `@tvkitchen/base-classes` version of Payload.
- TypeScript definitions related to `Payload`, `PayloadType`, and `PayloadParameters` are also exported.
- New `ValidationError` error.
- The `Payload` class now supports serialization and deserialization to bytes / Buffer.
- The `PayloadArray` class is now part of the countertop. It has a slightly modified API.

### Fixed
- Countertop topologies will no longer create redundant streams containing partially complete tributary sets when a more complete tributary superset is available for a given station.

## [0.4.1] - 2022-06-08
### Changed
- Update `@tvkitchen/base-classes` to version `2.0.0-alpha.2` in order to support longer streams.

## [0.4.0] - 2022-03-04
### Changed
- Require Node v16.
- Update `@tvkitchen/base-interfaces` to version `4.0.0-alpha.5`.

### Added
- The static `getInputTypes` and `getOutputTypes` Appliance methods are now provided the relevant settings values, allowing for dynamic types.

### Fixed
- Topologies with Appliances that only have a subset of their input satisfied will no longer break ([Issue #149](https://github.com/tvkitchen/countertop/issues/149)).

## [0.3.0] - 2021-05-13
### Changed
- Update `@tvkitchen/base-classes` to version `2.0.0-alpha.1`.
- Update `@tvkitchen/base-interfaces` to version `4.0.0-alpha.4`.
- Specify Kafka topic data retention times to 30 seconds.

### Added
- Appliances can now be added to a countertop without having sources for any given input.

## [0.2.1] - 2021-04-07
### Changed
- Update `@tvkitchen/base-classes` to version `1.4.0-alpha.2`.

## [0.2.0] - 2020-10-18
### Changed
- Update `CountertopWorker` to interface with Transform-based `IAppliance`s.

## [0.1.1] - 2020-09-22
### Added
- `Countertop` now has a default value for `kafkaSettings.brokers`.
### Changed
- Removed an old configuration file.
- Removed unused dependencies.
- Test libraries are now properly categorized as `devDependencies`.

### Fixed
- Message ordering from CountertopWorkers are now guaranteed.

## [0.1.0] - 2020-09-09
### Added
- Initial implementation of the `countertop` package.

[Unreleased]: https://github.com/tvkitchen/appliances/compare/@tvkitchen/countertop@0.4.1...HEAD
[0.4.1]: https://github.com/tvkitchen/countertop/releases/tag/@tvkitchen/countertop@0.4.1
[0.4.0]: https://github.com/tvkitchen/countertop/releases/tag/@tvkitchen/countertop@0.4.0
[0.3.0]: https://github.com/tvkitchen/countertop/releases/tag/@tvkitchen/countertop@0.3.0
[0.2.1]: https://github.com/tvkitchen/countertop/releases/tag/@tvkitchen/countertop@0.2.1
[0.2.0]: https://github.com/tvkitchen/countertop/releases/tag/@tvkitchen/countertop@0.2.0
[0.1.1]: https://github.com/tvkitchen/countertop/releases/tag/@tvkitchen/countertop@0.1.1
[0.1.0]: https://github.com/tvkitchen/countertop/releases/tag/@tvkitchen/countertop@0.1.0
