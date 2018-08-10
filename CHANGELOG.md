# Change Log
All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).
All minor versions less than 1.0.0 are breaking changes.

## [0.1.0] - 2018-03-25
### Fixed
- `new ResizeObserver`, `ResizeObserver.prototype.observe`, and , `ResizeObserver.prototype.unobserve` should throw a `TypeError` when called with no arguments or the wrong argument type.

## [0.0.4] - 2016-10-26
### Fixed
- Use `setTimeout` instead of `setInterval` for fallback when `requestAnimationFrame` doesn't exist

## [0.0.3] - 2016-06-10
### Changed
- Updated CHANGELOG with links to diffs

### Fixed
- Removed erroneous `[` from Typescript definition file
- Improved Typescript definition file to more closely describe the interface

## [0.0.2] - 2016-06-08
### Added
- tests using mocha, chai, mock-browser, mock-raf

### Fixed
- get basic tests running
- several critical typos and bugs that kept anything from working
- CHANGELOG is now CHANGELOG.md for proper viewing in Github

## 0.0.1 - 2016-06-07
### Added
- base untested resize-observer
- resize-observer typescript definition file
- readme
- license
- npm package

[0.1.0]: https://github.com/pelotoncycle/resize-observer/compare/v0.0.4...v0.1.0
[0.0.4]: https://github.com/pelotoncycle/resize-observer/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/pelotoncycle/resize-observer/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/pelotoncycle/resize-observer/compare/v0.0.1...v0.0.2
