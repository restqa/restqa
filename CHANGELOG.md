# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - Soon


After 1 year of being idle, RestQA is back with a major version! 🚀🚀🚀
RestQA is now focusing on providing the best automation testing experience for Microservice.
Major breaking changes need to be addressed. There is no compatibility between the previous version and the new one.
If you don't want to focus on the microservice testing you can stick to the version [0.0.38]

## [1.0.0-rc5] - 2022-12-27

### Added
* Doc improvment by @olivierodo in https://github.com/restqa/restqa/pull/294
* package: new package @restqa/screenshot by @olivierodo in https://github.com/restqa/restqa/pull/298
* feat: Use RestQA as a test runner for the plugin mongodb-mock by @olivierodo in https://github.com/restqa/restqa/pull/304
* Feat:  Use RestQA as test runner for the plugin-faker by @olivierodo in https://github.com/restqa/restqa/pull/305
* Spike: use scarf-js to track adoption by @olivierodo in https://github.com/restqa/restqa/pull/318
* Feature: update the gitignore while onboarding RestQA into a project by @olivierodo in https://github.com/restqa/restqa/pull/319

### Updated

* refacto: use RestQA to test the plugin HTTP MOCK by @olivierodo in https://github.com/restqa/restqa/pull/301
* Refacto performance by @olivierodo in https://github.com/restqa/restqa/pull/321
* refacto: create a package @restqa/core-collection by @olivierodo in https://github.com/restqa/restqa/pull/322
* Refacto:  executor -> @restqa/core-microservice by @olivierodo in https://github.com/restqa/restqa/pull/323
* DX: Refactor the example folder by @olivierodo in https://github.com/restqa/restqa/pull/330

### Fix

* Fix: increase default boot timeout by @tony-go in https://github.com/restqa/restqa/pull/296
* Fix: increase boot timeout for mongo mock plugin by @tony-go in https://github.com/restqa/restqa/pull/297
* Fix: issue when the response body is empty by @olivierodo in https://github.com/restqa/restqa/pull/306
* Fix: api specification should also handle querystrings by @olivierodo in https://github.com/restqa/restqa/pull/310
* Fix mongodb plugin by @olivierodo in https://github.com/restqa/restqa/pull/312
* Fix: add a loading message while the swagger ui is loading - report ui by @olivierodo in https://github.com/restqa/restqa/pull/314
* Fix: Historical conflict - Report ui by @olivierodo in https://github.com/restqa/restqa/pull/315
* Fix host request by @olivierodo in https://github.com/restqa/restqa/pull/316
* Fix: Misleading error message when an error occured at the runtime by @olivierodo in https://github.com/restqa/restqa/pull/317
* Fix: .cjs file for custom step definition by @olivierodo in https://github.com/restqa/restqa/pull/320
* Fix: Artillery fixture generation if there is no content-type by @olivierodo in https://github.com/restqa/restqa/pull/326
* Fix: The host variable on the postman collection by @olivierodo in https://github.com/restqa/restqa/pull/325
* Fix: Kill microservice if a process signal is received by @olivierodo in https://github.com/restqa/restqa/pull/328

## [1.0.0-rc4] - 2022-12-05

### Added

- New Feature: `restqa sandbox` allowing test scenario generation [#279](https://github.com/restqa/restqa/pull/279)
- New Feature: enable user to add their own step definition [#273](https://github.com/restqa/restqa/pull/273)
- Centralize the documentation into the RestQA Report [#219](https://github.com/restqa/restqa/pull/219)
- Enable Code coverage for local testing [#228](https://github.com/restqa/restqa/pull/228)
- Generate HTTP Mock [#214](https://github.com/restqa/restqa/pull/214)
- Generate postman collection [#215](https://github.com/restqa/restqa/pull/215)
- Generate API specification [#206](https://github.com/restqa/restqa/pull/206)
- Generate Performance testing fixture [#205](https://github.com/restqa/restqa/pull/205)


### Updated

- Snippet: Enable recommendation when a step definition is incorrect [#244](https://github.com/restqa/restqa/pull/244)
- RestQA report: format the table and inline argument [#228](https://github.com/restqa/restqa/pull/228)
- Update the example folder to share multiple example [#227](https://github.com/restqa/restqa/pull/227)
- Add a screencast and a pre-requisite feature on the documenation [#239](https://github.com/restqa/restqa/pull/239)
- [cucumber-export] Change the ui report design [#271](https://github.com/restqa/restqa/pull/271)

### Fix

- Display an error message when no test has been found [#242](https://github.com/restqa/restqa/pull/242)



## [0.0.38] - 2021-12-10

### Added

- Run init before run command if no config file exists [#166](https://github.com/restqa/restqa/issues/166)

### Updated

- Bump a few packages: `templ`, `ws`, `url-parse`, `prismjs`, `axios` & `post-css`.


## [0.0.37] - 2021-12-08

### Fixed
* RestQA init issue due to missing description [#178](https://github.com/restqa/restqa/issues/178)


## [0.0.36] - 2021-11-16

## Added

- Refactor the executor aiming to run it at the hook level | [#163](https://github.com/restqa/restqa/pull/163)
- Delete `ENV` & `URL` from initialize questions | [#165](https://github.com/restqa/restqa/pull/165)
- Make `description` optional from initialize questions | [#168](https://github.com/restqa/restqa/pull/168)

## Updated

- Update markdown linter version

## Fixed

- Add E2E test for HTTP mock plugin | [#167](https://github.com/restqa/restqa/pull/167)
- Only run the welcome test links from the CI | [#169](https://github.com/restqa/restqa/pull/169)
- Defer tweet and discord message publication after npm release in ci | [#162](https://github.com/restqa/restqa/pull/162)

## [0.0.35] - 2021-10-27

## Added

- Enable Fastify Plugin | [#154](https://github.com/restqa/restqa/pull/154) [#158](https://github.com/restqa/restqa/pull/158)
- Generating the .restqa.yml at the first visit of the route GET /restqa (in hooks context) | [#160](https://github.com/restqa/restqa/pull/160)

## Updated

- Bump `@restqa/cucumber-export` to `0.1.14`

## Bug Fix

- Rename output http-html-report -> html-remote | [#157](https://github.com/restqa/restqa/pull/157)

## [0.0.34] - 2021-10-14

## Added

- Enable Express middleware + Sandbox feature | [#146](https://github.com/restqa/restqa/pull/146)
- Microservice unit testing | [#148](https://github.com/restqa/restqa/pull/148)

## Updated

- Bump [@restqa/restqapi@0.1.2](https://github.com/restqa/restqapi/releases/tag/0.1.2)

## [0.0.33] - 2021-09-27

### Update

- Track sponsor redirection from the dashboard (from: [masonwoodford](https://github.com/masonwoodford)) | [#120](https://github.com/restqa/restqa/pull/139)
- Update the core architecture to relies on the package [@restqa/plugin](https://github.com/restqa/plugin) | [#142](https://github.com/restqa/restqa/pull/142)
- Bump [@restqa/restqapi@0.1.1](https://github.com/restqa/restqapi/releases/tag/0.1.1)
- Bump [@restqa/cucumber-export@.1.11](https://github.com/restqa/cucumber-export/releases/tag/0.1.12)

## [0.0.32] - 2021-07-27

### Added

- Enable Read only option on the dashboard| [#120](https://github.com/restqa/restqa/pull/120)

### Update

- Continuous integreation: enable linter check | [#127](https://github.com/restqa/restqa/pull/127)

## [0.0.31] - 2021-07-18

### Bug Fix

- Fix the regression on the command: `restqa generate` | [#124](https://github.com/restqa/restqa/pull/124)

### Update

- Enable the dashboard to run on a specific folder | [#122](https://github.com/restqa/restqa/pull/122)
- [Bump @cucumber/cucumber@7.3.0](https://github.com/cucumber/cucumber-js/releases/tag/v7.3.0)
- [Bump @restqa/cucumber-export@0.1.11](https://github.com/restqa/cucumber-export/releases/tag/0.1.11)
- [Bump @restqa/restqapi@0.1.0](https://github.com/restqa/restqapi/releases/tag/0.1.0)

## [0.0.30] - 2021-07-11

### Added

- Enable new command to mange the telemetry : `restqa telemetry off` | [#119](https://github.com/restqa/restqa/pull/119)

### Bug Fix

- HTML report: remove hidden steps | [#71](https://github.com/restqa/cucumber-export/pull/71)
- Improve equals error by adding the type of the value to compare| [#80](https://github.com/restqa/restqapi/pull/80)

### Update

- [Bump commander@8.0.0](https://github.com/tj/commander.js/releases/tag/v8.0.0)
- [Bump @restqa/cucumber-export@0.1.10](https://github.com/restqa/cucumber-export/releases/tag/0.1.10)
- [Bump @restqa/restqapi@0.0.19](https://github.com/restqa/restqapi/releases/tag/0.0.19)

## [0.0.29] - 2021-06-29

### Added

- [Enable the user interface for restqa](https://docs.restqa.io/getting-started/dashboard) | [#110](https://github.com/restqa/restqa/pull/110) [#111](https://github.com/restqa/restqa/pull/111)

### Bug fix

- Fix the Run method from the restqa instance | [#73](https://github.com/restqa/restqa/pull/73)

### Update

- Bump @restqa/cucumber-export@0.1.9

## [0.0.28] - 2021-06-12

### Added

- [Add Jenkins CI integration](https://docs.restqa.io/ci-cd/jenkins) | [#105](https://github.com/restqa/restqa/pull/105)

### Bug fix

- Fix missing scenario on the html report | [#63](https://github.com/restqa/cucumber-export/pull/63)
- Fix the restqa dashboad command with the default parameter | [#108](https://github.com/restqa/restqa/pull/108)

## [0.0.27] - 2021-05-29

### Added

- [Expose the dashboard as a module method](https://docs.restqa.io/api/cli#dashboard) | [#91](https://github.com/restqa/restqa/pull/91)
- Create a new endpoint on the RestQA server api **/reports** | [#93](https://github.com/restqa/restqa/pull/93)
- Improve command line performance | [#95](https://github.com/restqa/restqa/pull/95)
- Improve the installation user experience | [#94](https://github.com/restqa/restqa/pull/94)
- [Enable Custom Webhook Alerting](https://docs.restqa.io/alerting/webhook) | [#99](https://github.com/restqa/restqa/pull/99)
- Enable the project initialization from the dashboard | [#100](https://github.com/restqa/restqa/pull/100)

### Bugfix

- Dashboard UI

## [0.0.26] - 2021-05-13

### Added

- [Generation of the Performance test scenario compatible with artillery](https://docs.restqa.io/performance/artillery) | [@restqa/restqapi@0.0.18 plugin #66](https://github.com/restqa/restqapi/pull/66)
- [Create new command: restqa example](./example) | [#76](https://github.com/restqa/restqa/pull/76)
- Change the name of the command `restqa editor` to be `restqa dashboard` [preview](https://dashboard.restqa.io) | [#79](https://github.com/restqa/restqa/pull/79)

### Update

- [Update the Github Action configuration: Upload the test report as an artifact](https://docs.restqa.io/ci-cd/github-action) | [#85](https://github.com/restqa/restqa/pull/85)
- [Update the Gitlab-CI configuration: Upload the test report as an artifact](https://docs.restqa.io/ci-cd/gitlab-ci) | [#86](https://github.com/restqa/restqa/pull/86)
- [Update the Bitbucket Pipeline configuration: Upload the test report as an artifact](https://docs.restqa.io/ci-cd/bitbucket-pipeline) | [#87](https://github.com/restqa/restqa/pull/87)
- [Share small tips with the command output](https://docs.restqa.io/getting-started/configuration#restqatips) | [#90](https://github.com/restqa/restqa/pull/90)

## [0.0.25] - 2021-05-04

### Added

- [Enable line App Alerting](https://docs.restqa.io/alerting/line) | [#65](https://github.com/restqa/restqa/pull/65)
- [Extend RestQA capability through Plugins](https://docs.restqa.io/plugin/getting-started) | [#66](https://github.com/restqa/restqa/pull/66)
- [Add an example folder](./example) | [#71](https://github.com/restqa/restqa/pull/71)
- [Option to extend the timeout](https://docs.restqa.io/getting-started/configuration#restqatimeout) | [#72](https://github.com/restqa/restqa/pull/72)
- 🎁 Setup the new command to start the Editor: `restqa editor` | [#74](https://github.com/restqa/restqa/pull/74)

### Update

- improve windows OS compatibility | [#67](https://github.com/restqa/restqa/pull/67)
- Use [update-notifier](https://github.com/yeoman/update-notifier) to replace the previous custom implementation | [#68](https://github.com/restqa/restqa/pull/68)
- Bump [@restqa/cucumber-export@0.1.5](https://github.com/restqa/cucumber-export/releases/tag/0.1.5)

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

[unreleased]: https://github.com/restqa/restqa/compare/1.0.0...HEAD
[1.0.0]: https://github.com/restqa/restqa/compare/1.0.0-rc5...1.0.0
[1.0.0-rc5]: https://github.com/restqa/restqa/compare/1.0.0-rc4...1.0.0-rc5
[1.0.0-rc4]: https://github.com/restqa/restqa/compare/0.0.38...1.0.0-rc4
[0.0.38]: https://github.com/restqa/restqa/compare/0.0.37...0.0.38
[0.0.37]: https://github.com/restqa/restqa/compare/0.0.36...0.0.37
[0.0.36]: https://github.com/restqa/restqa/compare/0.0.35...0.0.36
[0.0.35]: https://github.com/restqa/restqa/compare/0.0.34...0.0.35
[0.0.34]: https://github.com/restqa/restqa/compare/0.0.33...0.0.34
[0.0.33]: https://github.com/restqa/restqa/compare/0.0.32...0.0.33
[0.0.32]: https://github.com/restqa/restqa/compare/0.0.31...0.0.32
[0.0.31]: https://github.com/restqa/restqa/compare/0.0.30...0.0.31
[0.0.30]: https://github.com/restqa/restqa/compare/0.0.29...0.0.30
[0.0.29]: https://github.com/restqa/restqa/compare/0.0.28...0.0.29
[0.0.28]: https://github.com/restqa/restqa/compare/0.0.27...0.0.28
[0.0.27]: https://github.com/restqa/restqa/compare/0.0.26...0.0.27
[0.0.26]: https://github.com/restqa/restqa/compare/0.0.25...0.0.26
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
