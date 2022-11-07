---
id: microsoft-teams
title: Microsoft team
sidebar_label: Microsoft team
order: 5
parent: alerting
---

Setting a **Microsoft Team** alerting is simple:

## Pre-requisite

 * 1 minute  🚀
 * Create a microsoft team webhook : [Guide to create an incoming webhook on Microsoft Team](https://docs.microsoft.com/en-us/learn/modules/msteams-webhooks-connectors/5-exercise-incoming-webhooks)
 * Valid RestQA config file.

## Configuration 

```yaml
tests:
  integrations:
  - name: sandbox
    outputs:
      - type: 'microsoft-teams'
        enabled: true
        config: 
          url: !env-var MSTEAM_WEBHOOK_URL
          onlyFailed: false
          showErrors: true
```

### Options

| *Property*   | *Description*                                                                                | *Default*          |
|:-------------|:---------------------------------------------------------------------------------------------|:-------------------|
| `url`        | The microsoft team webhook url                                                               |                    |
| `onlyFailed` | Trigger the hook only for test failure                                                       | `true`             |
| `showErrors` | Show the error message within discord                                                        | `false`            |
| `reportUrl`  | The url to access to your detail test report if you have one (`{uuid}` is a placeholder)     |                    |


> About the `config.url` we recommend to use the `!env-var` keyword in order to use an [environment variable](/getting-started/environment-variable) and not expose a sensitve url into your configuration.

## Example

![microsoft team example](../assets/cucumber-export-teams.png)

