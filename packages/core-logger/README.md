# @restqa/core-logger

> This package is private, it's only used internally (not published on npm)

## Description

Package responsible of the log and locale management

## Usage

```js
const { Logger, Locale } = require('@restqa/core-logger')

Logger.error("service.init.success.welcome");
// or 
console.log(Locale().service.init.success.welcome)
```


## Test

```
npm test
```

or 

```
npm run test:watch
```


