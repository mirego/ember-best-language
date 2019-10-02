# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2019-10-02
### Breaking
- `bestLanguage` and `bestLanguageOrFirst` now only return app supported languages, see [#33](https://github.com/mirego/ember-best-language/pull/33)

### Changed
- Add latest Ember LTS version to test matrix
- Update dependencies

## [1.0.4] - 2019-03-18
### Fixed
- Warnings for TypeScript + decorators versions
- Bug where `navigator.languages` was undefined in IE11

## [1.0.3] - 2018-12-10
### Fixed
- Update yarn.lock

## [1.0.2] - 2018-12-10
### Fixed
- Move ember-decorators to dependencies instead of devDependencies

## [1.0.1] - 2018-12-09
### Fixed
- Relax supported node versions

## [1.0.0] - 2018-12-03
### Breaking
- Remove support for older versions of Ember, from now on we test for the 3.4 LTS and newer

### Added
- Support for country codes [@pboutin](https://github.com/pboutin).

### Changed
- Translate codebase to TypeScript and lint with tslint
- Use prettier to format code
- Update eslint config

## [0.1.0] - 2017-10-07
### Added
- Support for non-FastBoot apps

## [0.0.3] - 2017-07-19
### Fixed
- Fix cases where the Accept-Language header is not present [@pkvince](https://github.com/pkvince)

## [0.0.2] - 2017-06-28
### Changed
- Change language properties order to prioritize browser languages over the OS ones [@paquetgp](https://github.com/paquetgp)
