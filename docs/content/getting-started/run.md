---
id: run
title: Test execution
parent: getting-started
order: 3

---

In order to run your test scenario you will need to ensure your project contains a valid [RestQA configuration](#/documentation/configuration) file `.restqa.yml`

Then from there you can run the command:

```bash
restqa run
```

The command above will search for `*.feature` files recursively from the root folder and execute them.

### Show the Report

```bash
restqa run --report
```

### Specify the configuration file

You can also explicitly specify a configuration file to use with the `--config` CLI option (resolved relative to cwd):

```bash
restqa run --config my-config.yml
```

Or through the environment variable `RESTQA_CONFIG`

```bash
RESTQA_CONFIG=my-config.yml restqa run
```

> More detail about the configuration file [here](#/documentation/configuration)


### Specify the target environemt (Integration testing)

You can also specify the environment to use with the `--env` CLI option:

```bash
restqa run --env uat
```

Or through the environment variable `RESTQA_ENV`

```bash
RESTQA_ENV=uat restqa run
```

> More detail about RestQA integration testing [here](#/documentation/integration-testing)

### Specify the feature file

#### Glob patterm

```bash
restqa run tests/integration/**/*.feature
```

#### Feature directory

```bash
restqa run tests/integration/
```

#### Specify a feature file

```bash
restqa run tests/integration/welcome.feature
```

### Specify the Gherkin Tag

If your feature or your scenario has a tag:

```gherkin
@success
Feature: Customer detail feature

Scenario: Retrieve all the customer information
...
```

You can run the following command
```bash
restqa run -t @success
```

