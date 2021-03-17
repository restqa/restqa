# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.22] - 2021-02-XX	
### Added
- Changelog | #53
- Enable Gherkin tags | #49
- Latest version checker | #52

## [0.0.21] - 2021-02-12
### Added
- [Expose the step definitions as a module methods](https://docs.restqa.io/api/api-reference#stepsoptions)
- [Expose the runner as a module methods](https://docs.restqa.io/api/api-reference#runoptions)
- Add Circle CI integration | #43
- Add Travis CI integration | #44
- Add debug env var | #14

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
- Create a new command to generate api scenario from a curl command `restqa generate curl -X GET http://api.example.com`
- Draft a new command to initiate a restqa project `restqa init -y`

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

[Unreleased]: https://github.com/restqa/restqa/compare/v0.0.22...HEAD
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
