# @restqa/core-collection

> This package is private, it's only used internally (not published on npm)

## Description

Package responsible of generating the api collection for the different 3rd party tools

## Usage

```js
const Collection = require('@restqa/core-collection')

const options = {
  resultFolder: 'tests',
}

const instance = new Collection(options)

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


