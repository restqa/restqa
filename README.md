<p align="center"><img src="https://restqa.io/assets/img/content/mascote.png" alt="RestQA logo"/></p>
<h1 align="center">RestQA</h1>
<h3 align="center">Test Driven Happiness</h3>
<p align="center">Making Backend engineer happy by applying world class developer experience through Microservice Testing</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@restqa/restqa"><img src="https://img.shields.io/npm/v/@restqa/restqa" alt="npm package"></a>
  <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/@restqa/restqa" alt="node compatility"></a>
  <a href="https://github.com/restqa/restqa/actions/workflows/build.yml"><img src="https://github.com/restqa/restqa/actions/workflows/build.yml/badge.svg" alt="github action build"></a>
  <a href="https://hub.docker.com/r/restqa/restqa"><img src="https://img.shields.io/docker/v/restqa/restqa/latest" alt="Docker build"></a>
  <a href="https://restqa.io/chat"><img src="https://img.shields.io/badge/chat-discord-blue?style=flat&logo=discord" alt="discord chat"></a>
</p>
<p align="center">
    <a href="https://dashboard.restqa.io/#/documentation/introduction">📖 Documentation</a>
</p>

> Still under development... The release 1.0.0 is coming soon, Feel free to contribute!

## 😃 Why Test Driven Happiness?

Within our DEV team while working with microservice, we realized a few thing:

- [X] **WE HATE** Writting Local Test
- [X] **WE HATE** Reviewing long unreadable Local Test full of mocks
- [X] **WE HATE** Maintaining the Integration Test
- [X] **WE HATE** Maintaining the Performance Test
- [X] **WE HATE** Maintaining the API specification
- [X] **WE HATE** Maintaining the postman collection
- [X] **WE HATE** Maintaining the HTTP Mocks
- [X] **WE HATE** Rewrite the test while changing the microservice technology

This is why we decided to challenge ourself on how to transform this frustration into a positive initative.
RestQA was build with a simple goal: Driving the happiness of the DEV team through testing.

Run one command and get everything that you need to enjoy maintaining your microservice.

#### Synthax

Gherkin Based but **KEEP CALM It aint's BDD!**

![Step definition](https://restqa.io/assets/img/content/2-why-step1.gif)

#### Screenshot

👉 [Access to our online demo](https://dashboard.restqa.io)

![Screenshot](https://restqa.io/assets/img/content/2-why-step2.png)

## ⭐️ Features

- 🌈 Local API test as Single source of truth
- 💬 Write local API test using ordinary language
- 🚦 Reuse your local API test to run the integration test
- 🎯 Get code coverage from your local tests
- 🏎  Generate Performace Test scenario compatible with your favorite Performance testing tool
- 📚  Generate an up to date API specification from the test results
- 👩‍🚀 Generate an up to date postman collection
- 🕐 Instant result
- 👑 Programming language Agnostic
- 👩‍💻 Community Driven

## 🎬 Demo

https://user-images.githubusercontent.com/4768226/205502972-1fddb8f2-130e-4071-a9f5-de4bc2406497.mp4

## 📦 Install

Once you get nodeJs on your local machine run the command

```
npm install -D @restqa/restqa
```

```
yarn add @restqa/restqa -D
```

## 🎯 Usage

In you `package.json` add the script:

```
  "scripts": {
    "test": "restqa run",
    "happy": "restqa run --report"
  }

```

Run the command:

```
npm test
```

It will automatically initialize RestQA into your project and generate the initial test for you ^^

Then you can Write your Unit Test Using ordinary language:

```gherkin
Feature: GET /api/infos

Scenario: Get the list of informations
Given a request
When GET "/api/info"
Then status = 200
  And body:
  """
{
  "message": "Hello World!"
}
  """
```

Then simply run the command to get full report:

```
npm run happy
```

## 🌈 Example

Take a look at the [examples folder](./examples) to see a basic setup.

## 🚧 Roadmap

##### 🚀 Local Test

- [X] Test coverage
- [X] [Mock external http depedencies](./packages/plugin-http-mock)
- [X] [Mock MongoDB database](./packages/plugin-mongodb)
- [ ] Mock Postgres database
- [ ] Mock MySQL database
- [ ] Mock S3 database
- [ ] Mock Redis store

##### 🚦 Integration Test

- [X] Slack (alerting)
- [X] Discord (alerting)
- [X] Mattermost (alerting)
- [X] Microsoft Team (alerting)
- [X] Line (alerting)
- [X] Webhook (alerting)
- [ ] Kibana (Monitoring)
- [ ] Grafana (Monitoring)
- [X] Excel (Data)
- [X] Google Sheet (Data)
- [X] File system (Data)

##### 🏎 Performance Test

- [X] Artillery.io
- [ ] K6 (Need contribution [#291](https://github.com/restqa/restqa/issues/291))
- [ ] Jmeter (Need contribution [#290](https://github.com/restqa/restqa/issues/290))
- [ ] Vegeta (Need contribution [#289](https://github.com/restqa/restqa/issues/289))

#### 📚 API Specification

- [X] OAS (swagger)
- [ ] Raml

#### 👩‍🚀 API Collection

- [X] Postman
- [ ] Insomnia (Need contribution [#293](https://github.com/restqa/restqa/issues/293))
- [ ] hoppscotch (Need contribution [#292](https://github.com/restqa/restqa/issues/292))

#### 📦 Continuous integration

- [X] Github Action
- [X] Gitlab CI
- [X] Jenkins
- [X] Circle CI
- [X] Travis CI
- [X] Bitbucket Pipeline
- [X] Docker
- [ ] Azure pipeline

## Big Love ❤️

RestQA Tesm would like to give a hug 🤗 to thanks the excellent work of the following dependent open source project:

* [Cucumber-js](https://github.com/cucumber/cucumber-js/)
* [VueJs](https://vuejs.org/)
* [Element-ui](https://element-plus.org)
* [C8](https://github.com/bcoe/c8)
* [Swagger Ui](https://github.com/swagger-api/swagger-ui)


## Contribution

See [Contributing Guide](./CONTRIBUTING.md).

## Author

- [@olivierodo](https://www.github.com/olivierodo) - 🇫🇷
- [@tonygo](https://github.com/tony-go) - 🇫🇷

## License

[MIT License](./LICENSE)
