# Change Log
All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).
All minor versions less than 1.0.0 are breaking changes.

## [1.0.0] - 2018-11-28
### Added
- Added `unpkg` field in `package.json`.
  You can now load `dist/resize-observer.min.js` via `<script src="https://unpkg.com/resize-observer"></script>`. (#14) Thanks @renaatdemuynck!

### Changed
- Migrate from Travis to CircleCI for PR tests (#13)
- Removed defective coverage badge (f65192b)

## [1.0.0-alpha.1] - 2018-08-21
### Changed
- Include `src/` files in the npm package (#12)

## [1.0.0-alpha.0] - 2018-08-13
### Changed
- `resize-observer` is now a [ponyfill](https://ponyfill.com)
- Rewritten in TypeScript
- Type declaration files are now generated

## [0.1.1] - 2018-08-10
### Fixed
- Added typings to `package.json`

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

[1.0.0-alpha.1]: https://github.com/pelotoncycle/resize-observer/compare/v1.0.0-alpha.0...v1.0.0-alpha.1
[1.0.0-alpha.0]: https://github.com/pelotoncycle/resize-observer/compare/v0.1.1...v1.0.0-alpha.0
[0.1.1]: https://github.com/pelotoncycle/resize-observer/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/pelotoncycle/resize-observer/compare/v0.0.4...v0.1.0
[0.0.4]: https://github.com/pelotoncycle/resize-observer/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/pelotoncycle/resize-observer/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/pelotoncycle/resize-observer/compare/v0.0.1...v0.0.2
