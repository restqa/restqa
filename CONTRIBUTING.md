# Contribution

Hi 👋🏼

Really happy to see you here ^^.

This document aims to onboard you onto RestQA contributing.

Feel free to hit us on [discord](https://restqa.io/chat) if you face a issue.

### Getting started

This repository is a monorepo an relies on [NPM Workspace](https://docs.npmjs.com/cli/v7/using-npm/workspaces)

### Pre-requisite

* Install NodeJs / npm
* Install pnpm package manager `npm i -g pnpm`

#### Complete install for End to End contribution

In order to build all the package and get RestQA fully built run the command:

```
npm run contribute
```

or


```
npm i -g pnpm
pnpm install
npm run build
pnpm install
npm run example
```

#### Contribute to the documentation

If you just want to contribute to the documentation, you can run simply run the command:

```
npm run contribute:docs
```

This short video below will help you understand the different steps.

https://user-images.githubusercontent.com/4768226/205432562-13c0e802-5809-4fb9-9a05-5703daae36ff.mp4


#### Contribute to the UI report

If you just want to contribute to the UI report, you will need to locate your developement into the `packages/report-ui`

```
cd packages/report-ui
npm run dev
```

This short video below will help you understand how you can contribute to the RestQA UI report.



https://user-images.githubusercontent.com/4768226/205433030-089ff616-1bc0-4b97-8aab-e5e9be6c0bc7.mp4



#### Contribute to the CLI 

This short video below will help you understand how you can contribute to the RestQA CLI.



https://user-images.githubusercontent.com/4768226/205433540-427965fc-f455-41ca-90a5-21c7d7603fc0.mp4



## Internals

### Project Structure

```
└── docs      # Documentation based markdown
│
└── examples  # Example projects using RestQA
│
└── packages  # List of packages
    │
    ├── cli                   # executing RestQA from argv
    │
    ├── cucumber-export       # Package handling report from cucumber
    │
    ├── data                  # Package handling data state
    │
    ├── docs                  # Documentation builder
    │
    ├── plugin                # Plugin builder
    │
    ├── plugin-faker          # Package to handle generation of fake data
    │
    ├── plugin-http-mock      # Package to handle http mock
    │
    ├── plugin-mongodb-mock   # Package to handle mongodb mock
    │
    ├── plugin-rest-api       # Package to handle rest api request
    │
    ├── report-ui             # Package for the UI report
    │
    └── sandbox               # Package managing the sandbox feature
```

## Tests

### Unit Tests

What do you need to know about the unit tests ?

* Technology: [jest](https://jestjs.io)
* Style: [chicago school](https://dev.to/hiboabd/a-beginners-explanation-of-the-chicago-london-approaches-4o5f)
* Command: `npm test`

### Functional Tests

Why ?

Because the RestQA command line is connected by multiple libraries and some breaking change can't be detected by the unit test.

* Technology: [bats](https://bats-core.readthedocs.io)
* Command: `npm run test:functional`

### Run functional tests in CI

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
$ docker run --rm -it -v $PWD:$PWD --workdir $PWD node:18 npm run test:functional
```

## Debugging

To see all the internal logs used in RestQA, set the DEBUG environment variable to restqa when launching your command.

```
DEBUG=restqa restqa step then
```
