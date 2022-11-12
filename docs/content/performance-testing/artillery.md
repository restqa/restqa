---
id: artillery
title: Performance testing using Artillery
sidebar_label: Artillery.io
parent: performance-testing
order: 1
---

[Artillery](https://artillery.io) is an amazing Load testing tool with an GREAT Developer Experience.


RestQA is not running performance test. However RestQA is generating Artillery test scenario based on your functional tests


## Pre-requisite

 * 1 minute  🚀
 * [Artillery](https://artillery.io) installed
 * Valid RestQA configuration file
 * Valid Test scenario

## Configuration 

```yaml {13-14} title=".restqa.yml"
version: 0.0.1
metadata:
  code: EXAMPLE
  name: Example app
  description: This is the example app description
tests:
  unit:
    port: 8887
    command: npm run dev
  performance:
    tool: artillery
```

### Options

Additional options are availble, check the [performance testing](#/documentation/performance-testing) page

## Scenario

In order to select a scenario to be run through Artillery, just add the tag `@performance` on top of it:

Example: 
```gherkin title="tests/integration/get-product.feature" {1-1}
@performance
Scenario Outline: The product doesn't exist into the database
Given a request
  And the headers:
    | accept-language | en |
    | content-type    | application/json |
When GET "/api/products/111111"
Then status = 200
  And the response time < 100 ms
  And "message" = "hello world"
```

## Generate the load test scenario:

The Artillery scenario will be generated every time you run the RestQA tests:

```
restqa run --report
```

## Run your performance tests

RestQA will only generate the Artillery Scenario, **it will not create the Artillery configuration for you**, we are recommending that you store the configuration into a file.

Example:
```yaml title="tests/performance/config.yml"
config:
  target: "https://example.com"
  phases:
    - duration: 10
      arrivalRate: 1
```

Then run your artillery command:

```
artillery -c tests/performance/config.yml tests/performance/
```

And Voila!

Now it's opening the door to get your start performance testing step into your continuous integration flow withing a few minutes.

## Example

[![asciicast](https://asciinema.org/a/WvSunWr8NBu9ogDgrA6CoBViU.svg)](https://asciinema.org/a/WvSunWr8NBu9ogDgrA6CoBViU)
