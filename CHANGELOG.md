# Changelog for @tvkitchen/countertop

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Update `@tvkitchen/base-classes` to version `1.4.0-alpha.2`

## [0.2.1] - 2020-10-18
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

[Unreleased]: https://github.com/tvkitchen/countertop/releases/tag/@tvkitchen/countertop@0.2.0...HEAD
[0.2.0]: https://github.com/tvkitchen/countertop/releases/tag/@tvkitchen/countertop@0.2.0
[0.1.1]: https://github.com/tvkitchen/countertop/releases/tag/@tvkitchen/countertop@0.1.1
[0.1.0]: https://github.com/tvkitchen/countertop/releases/tag/@tvkitchen/countertop@0.1.0
