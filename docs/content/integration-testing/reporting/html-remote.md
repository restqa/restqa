---
id: html-remote
title: Remote Html
parent: reporting
---

Setting the **Remote HTML** test report is very simple.

### What is remote html report ?

The remote html report is a report that will be hosted on a remote server.

### Why ?

The main reason is to enable an easy integration with some CI tools.
As you may use some tools like Github Action, Gitlab CI, and etc... are not allowing a simple viusalization of the test report.
Then RestQA is providing a way to send the result and access to it through a remote url.


## Pre-requisite

 * 1 minute  🚀
 * Valid RestQA configuration file
 * A deploy RestQA dashboard (if you want to self host your html reports)

## Configuration 

```yaml
tests:
  integrations:
  - name: sandbox
    outputs:
      - type: 'html-remote'
        enabled: true
        config: 
          url: 'https://restqa.my-company.com/reports'
```

### Options

| *Property*   | *Description*                                                                                | *Default*                          |
|:-------------|:---------------------------------------------------------------------------------------------|:-----------------------------------|
| `url`        | The location of the remote restqa dashboard                                                  | https://dashboard.restqa.io/report |

> To know more on how to use a self hosted version of the RestQA dashboard, take a look at [Dashboard](../getting-started/dashboard).


