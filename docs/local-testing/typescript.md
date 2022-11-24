---
id: typescript
title: Testing your typescript microservice
sidebar_label: Typescript microservice
parent: local-testing
order: 2
---

RestQA enhances developer experience, making microservice local testing easier.

## Getting started

Let's imagine a basic HTTP microservice written in typescript.

### Setup project with RestQA

- Init the repository with typescript
```bash
$ npm init -y
$ npm install --save-dev typescript   @types/node ts-node tsconfig-paths
```

- Install restqa:
```bash
$ npm i @restqa/restqa --save-dev
```

- Install express:
```bash
$ npm i express
$ npm i -D @types/express
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

- Add a base server in a `src/index.ts` file:

```js
import express from 'express'

const { PORT = 9999 } = process.env
const server = express();
 .get('/', (req, res) => {
    res.json({
      hello: 'world'
    })
  })
  .listen(PORT, () => {
    console.log('server run on port ' + PORT)
  })

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('server is closing')
  })
})

```

- Add a `dev` script in the `package.json`:

```json
{
  "scripts": {
    "dev": "ts-node -r tsconfig-paths/register src/index"
  }
}
```

### Write a scenario

Thanks to the embed RestQA HTTP plugin, writing scenarios is really easy.

- Let's create an `./tests/features/welcome.feature`:

```gherkin
Feature: Hello
  Scenario: Scenario all good
    Given a request
    When GET "/hello"
    Then status = 200
      And "value" = "world"
```

### Run your test:

Then, you can use the `restqa run` command.
RestQA will start the server for you and will shut it down once tests are executed.

- Add `test` script in the `package.json`:
```json {4}
{
  "scripts": {
    "start": "ts-node -r tsconfig-paths/register src/index",
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
