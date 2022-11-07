---
id: nodejs
title: testing your nodejs microservice
sidebar_label: Nodejs
parent: local-testing
order: 1
---

RestQA enhances developer experience, making microservice local testing easier.

## Getting started

Let's imagine a basic HTTP microservice.

### Setup project with RestQA

- Init the repository
```bash
$ npm init -y
```

- Install the dependencies:
```bash
$ npm i fastify @restqa/restqa --save-dev
```

- Create a `.restqa.yaml` at the root folder:

```yml
#.restqa.yml
---
version: 0.0.1
metadata:
  code: EXAMPLE-RESTQA
  name: Example Restqa
  description: Delicious Microservice example maintained with RestQA
tests:
  local:
    port: 9999
    command: npm run dev
```

- Add a base server in a `index.js` file:

```js
const fastify = require('fastify')

const PORT = process.env.PORT || 9999
const app = fastify({ logger: true })

app.get('/', (req, res) => {
  return { message: 'Welcome'}
})

await app.listen(PORT)
```

- Add a `dev` script in the `package.json`:

```json
{
  "scripts": {
    "dev": "node index.js",
  }
}
```

### Write a scenario

Thanks to the embed RestQA HTTP plugin, writing scenarios is really easy.

- Let's create an `./tests/features/welcome.feature`:

```gherkin
Feature: Hello
  Scenario: Scenario all good
    Given I have the api gateway
      And I have the path "/hello"
      And I have the method "GET"
    When I run the API
    Then I should receive a response with the status 200
      And the response body at "value" should equal "world"
```

### Run your test:

Then, you can use the `restqa run` command.
RestQA will start the server for you and will shut it down once tests are executed.

- Add `test` script in the `package.json`:
```json {4}
{
  "scripts": {
    "start": "node index.js",
    "test": "restqa run",
    "happy": "restqa run --report"
  }
}
```

- Now run the script "test" for simple test:

```bash
$ npm test
```

- Or run the script "happy" for the full test report:

```bash
$ npm run happy
```

- Output:

```shell
> restqa run 

Server is running (command: npm start)
> 🏹 Target url: http://localhost:9999
.........

1 scenario (1 passed)
6 steps (6 passed)
0m00.038s (executing steps: 0m00.016s)
```

🎉 Enjoy!
