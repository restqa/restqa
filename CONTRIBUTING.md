# Contribution

Hi 👋🏼

Really happy to see you here ^^.

This document aims to onboard you onto RestQA contributing.

Feel free to hit us on [discord](https://restqa.io/chat) if you face a issue.

### Getting started

This repository is a monorepo an relies on [NPM Workspace](https://docs.npmjs.com/cli/v7/using-npm/workspaces)

#### Simply run the command

```
npm run contribute
```

or


```
npm install
npm run build
npm run example:install
npm run example
```

#### Contribute to the documentation

This short video below will help you understand how you can contribute to the RestQA Documentation.

https://user-images.githubusercontent.com/4768226/202208731-31ca25d6-7b73-415b-b0c4-39803301702a.mp4

#### Contribute to the UI report

This short video below will help you understand how you can contribute to the RestQA UI report.

https://user-images.githubusercontent.com/4768226/202215697-9a7c048f-f577-4ebc-a7b9-3ec718cb8371.mp4

#### Contribute to the CLI 

This short video below will help you understand how you can contribute to the RestQA CLI.

https://user-images.githubusercontent.com/4768226/202217108-249d22cd-5ea1-4af3-ae8f-39b6b583f7c2.mp4



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
