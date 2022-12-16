# @restqa/core-performance

> This package is private, it's only used internally (not published on npm)

## Description

Package responsible of generating the performance test fixture for the different 3rd party tools

## Usage

```js
const Performance = require('@restqa/core-performance')

const options = {
  tool: 'artillery',
  outputFolder: 'tests/performances',
  onlySuccess: true,
}

const instance = new Performance(options)

// apis - from @restqa/plugin-rest-api
// scenario - from cucumber
instance.add(apis, scenario)
const result = instance.generate()
```

## Test

```
npm test
```

or 

```
npm run test:watch
```


