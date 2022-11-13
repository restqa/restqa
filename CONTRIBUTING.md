# Contribution

Hi 👋🏼

Really happy to see you here ^^.

This document aims to onboard you onto RestQA contributing.

Feel free to hit us on [discord](https://restqa.io/chat) if you face a issue.

### Getting started

This repository is a monorepo an relies on [NPM Workspace](https://docs.npmjs.com/cli/v7/using-npm/workspaces)

#### Install the dependencies:

```
npm i
```

#### Build all the packages

```
npm run build
```


#### Try your installation

```
npm run example:install
npm run example
```

ou

```
cd examples/nodejs
npm run happy
```

## Tests

### Unit Tests

What do you need to know about the unit tests ?

* Technology: [jest](https://jestjs.io)
* Style: [chicago school](https://dev.to/hiboabd/a-beginners-explanation-of-the-chicago-london-approaches-4o5f)
* Command: `npm test`
* Watch Command: `npm test:watch -w cli` *(Recommended during development session.)*
* Coverage command: `npm run test:coverage -w cli`


### Functional Tests

Why ?

Because the RestQA command line is connected by multiple libraries and some breaking change can't be detected by the unit test.

* Technology: [bats](https://bats-core.readthedocs.io)
* Command: `npm run test:functional -w cli`

### Run tests in CI

Sometimes in your hacking journey you'll have to handle backward compatibility for Node.JS 12.x, 14.x and 16.x.

So If you want to mimic the CI and run tests (unit or functional) in a previous version of node, you could use this template command:

```bash
$ docker run --rm -it -v $PWD:$PWD --workdir $PWD <node-version> <command>
```

Where:
- node-version: a docker image (like `node:12`, `node:14`...)
- command: a npm command from the package.json (like `npm run test`)

For example, if you want to run functional tests in Node.JS 12.x:

```bash
$ docker run --rm -it -v $PWD:$PWD --workdir $PWD node:18 npm run test:functional -w cli
```

## Debugging

To see all the internal logs used in RestQA, set the DEBUG environment variable to restqa when launching your command.

```
DEBUG=restqa restqa step then
```
