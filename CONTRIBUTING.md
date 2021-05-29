# Contribution

## Dashboard

The RestQA dashboard is a built with the VueJs technologie.

### Getting started

#### Install the dependencies:

```
npm run dashboard:install
```

#### Dashboard sample

```
npm run dashboard:example
```


#### Run the dashboard on dev mode without the backend apis

```
npm run dashboard:serve
```

#### Run the dashboard on dev mode with the backend apis


```
npm run dashboard:dev
```

Or using the no-config mode

```
npm run dashboard:dev:no-config
```

#### Build the Dashboard

```
npm run dashboard:build
```


## Tests

### Unit Tests

What do you need to know about the unit tests ?

* Technology: [jest](https://jestjs.io)
* Style: [chicago school](https://dev.to/hiboabd/a-beginners-explanation-of-the-chicago-london-approaches-4o5f)
* Command: `npm test`
* Coverage command: `npm run test:coverage`
* Test the Dashboard (vuejs): `npm run dashboard:test`


### Functionnal Tests

Why ?

Because the RestQA command line is connected by multiple libraries and some breaking change can't be detected by the unit test.

* Technology: [bats](https://bats-core.readthedocs.io)
* Command: `npm run test:functional`


## Debugging

To see all the internal logs used in RestQA, set the DEBUG environment variable to restqa when launching your command.

```
DEBUG=restqa restqa step then
```
