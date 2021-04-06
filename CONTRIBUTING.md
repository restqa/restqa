# Contribution

## Tests

### Unit Tests

What do you need to know about the unit tests ?

* Technology: [jest](https://jestjs.io)
* Style: [chicago school](https://dev.to/hiboabd/a-beginners-explanation-of-the-chicago-london-approaches-4o5f)
* Command: `npm test`
* Coverage command: `npm run test:coverage`


### Functionnal Tests

Why ?

Because the RestQA command line is connecting with multiple libraries and some breaking change can't be detected by the unit test.

* Technology: [bats](https://bats-core.readthedocs.io)
* Command: `npm run test:functional`


## Debugging

To see all the internal logs used in RestQA, set the DEBUG environment variable to restqa when launching your command.

```
DEBUG=restqa restqa step then
```
