# HTTP Mock RestQA Plugin

👻 | Plugin extending the RestQA capability in order to mock all the external HTTP request made by your microservice

> Nothing is more annoying than mocking an external HTTP API on unit test!

![banner](https://raw.githubusercontent.com/restqa/http-mock-plugin/main/assets/mock-http.png)


## Description

### What is the problem this plugin solving?

Microservice architecture is amazing because it helps to keep the atomicity of a service. However, most of the time microservice are not independent, they depend on thirds party APIs.
With this plugin we want to make mocking of external HTTP services easy while testing microservice using RestQA.

## Installation

Within your microservice project tested by RestQA, run the following command:

```
npm i @restqa/http-mock-plugin
```

***In order to use this library your local machine MUST have docker installed.***


## Usage

Let's say you have ExpressJs microservice:

```js
// index.js
const express = require('express')
const got = require('got')

express()
  .get('/status', async (req, res) => {
      const url = process.env.GITHUB_API // This environement variable will be overrided
      const {body} = await got.get(url + "/status", {responseType: "json"});
      res.json(body)
  })
  .listen(3000, () => {
    console.log('Server running on port 3000')
  })
```

> ⚠️ Important! you need to use environement variable to manage your external HTTP request urls. The http-mock-plugin will override the selected environement variable accordingly.

In your existing `.restqa.yml` under plugins in the local environment section, add the following:

```yaml
...
- name: "@restqa/http-mock-plugin"
  config:
    folder: ./tests/data/stubs
    debug: false
    envs:
      GITHUB_API: github # the key is the same as the variable env in the server snipper.
 ...
```

### Options

| *Variable*   | *Description*                                                                         | *Default*             |
|:------------ |:--------------------------------------------------------------------------------------|:----------------------|
| `folder`     | The folder where there stub files are located                                         | `./tests/stubs`       |
| `debug   `   | Help you to debug the behavior of the plugin by printing information into the console | `false`               |
| `envs`       | List of environment that requires to be overrided (obj env: folder)                   |                       |     


### Example


#### Configuration

Example of a complete `.restqa.yml`: 

```yaml
# .restqa.yml
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
plugins:
- name: "@restqa/http-mock-plugin"
  config:
    folder: ./tests/data/stubs
    debug: false
  envs:
    GITHUB_API: github # GITHUB_API is the environement variable to override  / github is the folder name under the stub folder
```

#### Mocking

In order to mock an external call you will need create a folder into the `stubs` folder (example: github)
Then within this folder you will be required to add a list `yaml`
The yaml file will need to respect the following format:

```yaml
# ./tests/data/stubs/github/status.yml
request:
  url: /status
  method: GET
response:
  status: 200
  headers:
     content-type: application/json
  body: >
    {
      "message": "Hello World!"
    }
```

Then every time your microservice will perform a request targeting `GET http://api.github.com/status` the response will be:

```

< HTTP/2 200
< content-type: application/json; charset=utf-8

{
  "message": "Hello World!"
}
```
