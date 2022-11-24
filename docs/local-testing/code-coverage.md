---
id: coverage
title: Code Coverage
sidebar_label: Code Coverage
parent: local-testing
order: 3
---

A part of the RestQA ecosystem is to leverage the excellent work from [c8](https://github.com/bcoe/c8) and [istanbul.js](https://istanbul.js.org) in order to capture the test coverage.

By default RestQA will everytime you will use the options `--report` RestQA will automatically generate the test coverage.


### Recommendation

In order to prevent flaky result on the test coverage, ensure that you are closing the process  of your microservice gracefully.

Example:

```js
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('server is closing')
  })
})
```

> The test coverage report is a RestQA out of the box feature available only to NodeJS based microservices.\
If you are using a different language check the doc below 👇

### Custom code coverage

If you want to use a custom engine for you coverage, you can simply use the option `coverage` in the configuration.


#### Python example

Let's say you are using python and you want to use the standard python library to generate the coverage report, your `.restqa.yml` should look like:

```yaml
#.restqa.yml
---
version: 0.0.1
metadata:
  code: EXAMPLE-RESTQA
  name: Example Restqa
  description: Delicious Microservice example maintained with RestQA
tests:
  local:
    port: 8887
    command: coverage run index.py # instead of python index.py
    coverage: ./htmlcov/index.html # the path of the html coverage report generated
```


Then from there RestQA will be able to identified the location of the report and display it in the main RestQA Report.




