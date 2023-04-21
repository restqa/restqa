---
id: local-testing
title: Microservice local testing
sidebar_label: ⚙️ Local Testing
pre-requisit:
  - configuration
order: 6
---

# Test your microservice locally

RestQA enhances developer experience by making microservice local testing easier.

Finally an easy way to test microservices locally. While most of the testing framework are focusing on the meaningless test of function or classes.
RestQA target the testing at the input/output level, regardless of the technology, framework, version, etc..
RestQA aim to focus on testing the actual business responsibility of your service.

Only one command to run:

```bash
restqa run
```

# Behind the scene

![img](images/documentation/local.png)

And then RestQA will bring an 360 degree quality view of your service. Local testing has never been so cool!

# Get started

Depending on the technology that you use, you can refer to our documentation:

* [NodeJS](#/documentation/nodejs)
* [Typescript](#/documentation/typescript)

#### Options


| *Property*              | type           | *Description*                                                                | *Required* | *Default*                      |
|:------------------------|:---------------| -----------------------------------------------------------------------------|------------|:-------------------------------|
| `tests.local.port`      | number         | The port exposing the microservice server                                    | Yes        |                                |
| `tests.local.command`   | string         | The command used to run the microservice                                     | Yes        |                                |
| `tests.local.coverage`  | string         | The path of the test generated coverage page (for custom coverage reporter ) | No         | ./restqa/coverage/index.html   |
| `tests.local.envs`      | object         | The environment variable that need be injected in the microservice           | No         |                                |

#### Example

```yaml
#.restqa.yml
---
version: 0.0.1
metadata:
  code: EXAMPLE-RESTQA
  name: Example Restqa
  description: Delicious Microservice example maintained with RestQA
tests:
  local:
    port: 8887
    command: npm run dev
    envs:
      FOO: BAR
```

# Watch mode

RestQA does not support the watch mode, however if you are using a nodejs setup we would suggest that you install [Nodemon](https://www.npmjs.com/package/nodemon) and use the command:

```bash
nodemon --exec \"restqa run\" -e js,feature .
```
