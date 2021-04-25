# Changelog

All notable changes to this project is documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.25] - 2021-05-01

* improve windows OS compatibility | [#67](https://github.com/restqa/restqa/pull/67)
* [Enable line App Alerting](https://docs.restqa.io/alerting/line) | [#65](https://github.com/restqa/restqa/pull/65)
* [Extend RestQA capability through Plugins](https://docs.restqa.io/getting-started/plugins) | [#66](https://github.com/restqa/restqa/pull/66)
* Use [update-notifier](https://github.com/yeoman/update-notifier) to replace the previous custom implementation | [#68](https://github.com/restqa/restqa/pull/68)

## [0.0.24] - 2021-04-16
### Update
- [Enable functional testing](https://github.com/restqa/restqa/blob/master/CONTRIBUTING.md) | [#61](https://github.com/restqa/restqa/pull/61)
- [RestQA Plugin Generator](https://github.com/restqa/generator-plugin) | Yeoman Generator allowing anyone to create custom step definition and run then within RestQA

## [0.0.23] - 2021-04-02
### Bug Fix
- [Fix issue due to incorrect step definition](https://github.com/restqa/restqapi/commit/c9bc5952960a0bb79e179767a3f6109a8bea397b)

## [0.0.22] - 2021-04-02
### Added
- Changelog | [#54](https://github.com/restqa/restqa/pull/54)
- [Enable Gherkin tags](https://docs.restqa.io/getting-started/run#specify-the-gherkin-tag) | [#50](https://github.com/restqa/restqa/pull/50)
- [Latest version checker](https://docs.restqa.io/getting-started/version) | [#55](https://github.com/restqa/restqa/pull/55)
- [Enable command line to install Html exports](https://docs.restqa.io/reporting/html) | [#57](https://github.com/restqa/restqa/pull/57/commits/90167be4071a61bdfe5fb9de6d0ca1ff12634f70)
- [Enable command line to install JSON File exports](https://docs.restqa.io/reporting/json) | [#57](https://github.com/restqa/restqa/pull/57/commits/d76bdb57eed881d1594c26670e26f7382b391089)

### Update
- Bump default Plugin [@restqa/restqapi:0.0.16](https://github.com/restqa/restqapi/releases/tag/0.0.16)
  - New step definition: `Then the response body at {string} should be a date before {string}`
  - New step definition: `Then the response body at {string} should be a date after {string}`
  - New step definition: `Then the response body at {string} should be a date before today`
  - New step definition: `Then the response body at {string} should be a date after today`
  - New step definition: `Then the response body at {string} should match the json schema from {string}`
  - New step definition: `Then the response body should match the json schema from {string}`

## [0.0.21] - 2021-03-12
### Added
- [Expose the step definitions as a module methods](https://docs.restqa.io/api/api-reference#stepsoptions)
- [Expose the runner as a module methods](https://docs.restqa.io/api/api-reference#runoptions)
- [Add Circle CI integration](https://docs.restqa.io/ci-cd/circle-ci) | [#42](https://github.com/restqa/restqa/pull/42)
- [Add Travis CI integration](https://docs.restqa.io/ci-cd/travis-ci) | [#46](https://github.com/restqa/restqa/pull/46)
- Add debug env var | [#14](https://github.com/restqa/restqa/issues/14)

### Update
- Bump [@restqa/restqapi:0.0.15](https://github.com/restqa/restqapi/releases/tag/0.0.15)


## [0.0.20] - 2021-02-26
### Added
- Add the html export in order to get a report on the local system
- Add Snippet helper when a step is undefined #7 #31 

### Changes
- Use Html Report as a default report while initializing a new project

### Bug Fix
- Fix bug on CLI generate command #28 
- Fix issue on empty outputs #3 


## [0.0.19] - 2021-01-21
### Added
- Create a new CLI command to install http-html-report addons (ex: `restqa install http-html-report`)

## [0.0.18] - 2021-01-21
### Added
- Create a new CLI command to install google-sheet addons (ex: `restqa install google-sheet`)

## [0.0.17] - 2021-01-21
### Added
- Create a new CLI command to install excel (csv) addons (ex: `restqa install excel`)

## [0.0.16] - 2021-01-17
### Added
- Create a new CLI command to install Discord addons (ex: `restqa install discord`)

## [0.0.15] - 2021-01-17
### Added
- Create a new CLI command to install addons (ex: `restqa install slack`)

## [0.0.14] - 2021-01-16
### Added
- Create a new command to initialize a RestQa project: `restqa init`

## [0.0.13] - 2021-01-05
### Added
- Create a new command to fetch the step definition available: `restqa steps given`

## [0.0.12] - 2021-01-04
### Added
- Bump restqapi to 0.0.13 ( Ssl validation feature)

## [0.0.11] - 2020-12-30
### Added
- Create a new command to generate API scenario from a curl command `restqa generate curl -X GET http://api.example.com`
- Draft a new command to initiate a RestQA project `restqa init -y`

### Changed
- Improve the error management
- Colorize some console output

### Fix
- Fix the command `restqa step`

## [0.0.10] - 2020-12-24
### Added
- Allow the data storage config

## [0.0.9] - 2020-09-26
### Added
- Enable secret into the configuration file

[Unreleased]: https://github.com/restqa/restqa/compare/v0.0.25...HEAD
[0.0.25]: https://github.com/restqa/restqa/compare/0.0.24...0.0.25
[0.0.24]: https://github.com/restqa/restqa/compare/0.0.23...0.0.24
[0.0.23]: https://github.com/restqa/restqa/compare/0.0.22...0.0.23
[0.0.22]: https://github.com/restqa/restqa/compare/0.0.21...0.0.22
[0.0.21]: https://github.com/restqa/restqa/compare/0.0.20...0.0.21
[0.0.20]: https://github.com/restqa/restqa/compare/0.0.19...0.0.20
[0.0.19]: https://github.com/restqa/restqa/compare/0.0.18...0.0.19
[0.0.18]: https://github.com/restqa/restqa/compare/0.0.17...0.0.18
[0.0.17]: https://github.com/restqa/restqa/compare/0.0.16...0.0.17
[0.0.16]: https://github.com/restqa/restqa/compare/0.0.15...0.0.16
[0.0.15]: https://github.com/restqa/restqa/compare/0.0.14...0.0.15
[0.0.14]: https://github.com/restqa/restqa/compare/0.0.13...0.0.14
[0.0.13]: https://github.com/restqa/restqa/compare/0.0.12...0.0.13
[0.0.12]: https://github.com/restqa/restqa/compare/0.0.11...0.0.12
[0.0.11]: https://github.com/restqa/restqa/compare/0.0.10...0.0.11
[0.0.10]: https://github.com/restqa/restqa/compare/0.0.9...0.0.10
[0.0.9]: https://github.com/restqa/restqa/compare/0.0.8...0.0.9
