# Changelog for @tvkitchen/countertop

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
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

[Unreleased]: https://github.com/tvkitchen/countertop/releases/tag/@tvkitchen/countertop@0.1.0...HEAD
[0.1.0]: https://github.com/tvkitchen/countertop/releases/tag/@tvkitchen/countertop@0.1.0
