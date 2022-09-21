---
id: configuration
title: Configuring your First Test Automation Pipeline
sidebar_label: Configuration
parent: getting-started
order: 5
---

## Configuration File

When running `restqa` from the command line, RestQA automatically tries to resolve a configuration file named `.restqa.yml` inside the project root.

The most basic configuration file looks like this:

```yaml title=".restqa.yml"
version: 0.0.1
metadata:
  code: EXAMPLE
  name: Example app
  description: This is the example app description
environments:
  - name: local
    default: true
    data:
      channel: 'csv'
      config:
        folder: 'test/data'
        delimiter: ','
    secrets:
      userEmail: 'test@foo.com'
    plugins:
      - name: restqapi
        config:
          url: https://api.restqa.io
    outputs:
      - type: html
        enabled: true
```

You can also explicitly specify a configuration file to use with the `--config` CLI options (resolved relative to `cwd`). 

```bash
restqa run --config my-restqa.yml
```

## Options

### version

* **Type:** `string`
* **Required:** `yes`


Define which YAML schema version to use in executing the test.
Available : `0.0.1`

### metadata

* **Type:** `object`
* **Required:** `yes`

Data that helps uniquely identify the object.

### metadata.code

* **Type:** `string`
* **Required:** `yes`

Unique of the tested application.

### metadata.name

* **Type:** `string`
* **Required:** `yes`

Name of the tested application.

### metadata.description

* **Type:** `string`
* **Required:** `yes`

Short description of the tested application.

### environments

* **Type:** `[object]`
* **Required:** `yes`

Define an environment for your test since it's a list you can imagine having a different configuration per environment.


### environments[].name

* **Type:** `string`
* **Required:** `yes`

Environment name (example: local or uat)

### environments[].default

* **Type:** `boolean`
* **Required:** `yes`

During the execution when a specific environment did not pass, RestQA picks the environment with the `default` value set to `true`. 

### environments[].data

* **Type:** `object`
* **Required:** `no`

Define the data strategy during the test execution.

### environments[].data.channel

* **Type:** `string`
* **Required:** `yes`

Identify the external data source to use as test dataset.

### environments[].data.config

* **Type:** `object`
* **Required:** `yes`

Define the specific configuration related to the external data source.

### environments[].secrets

* **Type:** `object`
* **Required:** `no`

Key/Value object that will be loaded into the dataset in order to be reused into test scenarios. 

### environments[].plugins

* **Type:** `Plugin[]`
* **Required:** `yes`

Array of plugins to use. See [Plugin API](../api/plugin-api.md) for more details on RestQA plugins.

### environments[].outputs

* **Type:** `outputs[]`
* **Required:** `yes`

Array of outputs to use. Check [Ouputs API](../api/output-api.md) for more details on RestQA outputs.

### restqa

* **Type:** `object`
* **Required:** `no`

Specific configuration to pass to RestQA processor.

### restqa.timeout

* **Type:** `number`
* **Required:** `no`
* **Default:** `5000`

Decide the timeout for steps. Default is 5000 milliseconds.


### restqa.dashboard

* **Type:** `object`
* **Required:** `no`

Define the dashboard configuration.

### restqa.dashboard.readOnly

* **Type:** `boolean`
* **Required:** `no`

Restrict the access of the feature files to read only within the dashboard

### restqa.dashboard.server

* **Type:** `object`
* **Required:** `no`

Define the dashboard configuration (server side)

### restqa.dashboard.server.testFolder

* **Type:** `string`
* **Required:** `no`
* **Default:** `.`

Designate the location of the test `.feature` files

### restqa.dashboard.server.whiteList

* **Type:** `array`
* **Required:** `no`

In order to prevent cors issue, I recommend to list out url. This is in case you run client and server on 2 different location.

### restqa.dashboard.server.report

* **Type:** `object`
* **Required:** `no`

The following setting is relevant only if you plan to use the [Remote html](../reporting/html-remote.md) to send your report into a custom RestQA server.

### restqa.dashboard.server.report.urlPrefixPath

* **Type:** `string`
* **Required:** `no`
* **Default:** `/reports`

Specify the path that you want to access the reports and stored into your server.

### restqa.dashboard.server.report.outputFolder

* **Type:** `string`
* **Required:** `no`
* **Default:** `./reports`

Specify the location where to store the report into your server.

### restqa.tips

* **Type:** `object`
* **Required:** `no`

Settings for the small tips that are shared on the output console.

Example:

```yaml title=".restqa.yml" {17-20}
version: 0.0.1
metadata:
  code: TIPS EXAMPLE
  name: Config tips example
  description: Example to share tips
environments:
  - name: local
    default: true
    plugins:
      - name: restqapi
        config:
          url: https://api.restqa.io
    outputs:
      - type: html
        enabled: true
restqa:
  tips:
    enabled: true
    message:
    - Guys, do not forget to git push and commit before leaving the building!
```

### restqa.tips.enabled

* **Type:** `boolean`
* **Required:** `no`
* **Default:** `true`

Enable or disable the tips

### restqa.tips.messages

* **Type:** `array<string>`
* **Required:** `no`

Helps you to define custom tips.

