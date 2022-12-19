# @restqa/core-microservice

> This package is private, it's only used internally (not published on npm)

## Description

Package responsible of handling the microservice process runner

## Usage

```js
const Microservice = require('@restqa/core-microservice')

const options = {
  port: 8080,
  command: 'npm run dev',
  envs: {
    DEBUG: '*'
  },
  log: console.log
}

const instance = new Microservice(options)
await instance.start()
await instance.stop()

```

## Test

```
npm test
```

or 

```
npm run test:watch
```


