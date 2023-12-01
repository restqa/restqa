---
id: getting-started
title: 🚀 Getting started
order: 3

---

## Pre-requisite

* 1 minute
* NodeJS
* Docker (preferred if need testcontainers)

## Installation

In your project use the command:

```bash
npm i -D @restqa/restqa
```

```bash
yarn add @restqa/restqa -D
```
If you are running a NodeJS project simply add the following in your `package.json` in the `scripts` section: 

```js
"scripts": {
  ...
  "test": "restqa run",
  "happy": "restqa run --report"
}
```

## Initialization (First run)

Then you can now initate you RestQA project by running the command:

```bash
npm run happy
```

And Voila! It's time to write your first test 🚀.
