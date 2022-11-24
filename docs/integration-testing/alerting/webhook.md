---
id: webhook
title: Webhook
sidebar_label: Webhook
order: 7
parent: alerting
---

Webhooks allows you to POST custom payloads to any endpoint in your own infrastructure or a third party provider.
This will allow you to :

* Create your own alerting to a non supported tool from RestQa
* Create your own dashboard
* Trigger a job
* Etc...


Setting a **webhook** url is simple:

## Pre-requisite

 * 1 minute  🚀
 * Get your custom endpoint
 * Valid RestQA config file


## Configuration 

```yaml title=".restqa.yml"
tests:
  integrations:
  - name: sandbox
    outputs:
      - type: 'webhook'
        enabled: true
        config: 
          url: !env-var WEBHOOK_URL
          method: POST
          headers:
            apikey: 'xxx-yyy-zzz'
```

### Options

| *Property*   | *Description*                                                                                | *Required*        | *Default*          |
|:-------------|:---------------------------------------------------------------------------------------------|:------------------|:-------------------|
| `url`        | The webhook url                                                                              | true              |                    |
| `method`     | The http method to use in order to send the request body                                     | false             | `POST`             |
| `headers`    | Object containing the headers to be added into the request                                   | false             |                    |


> About the `config.url` we recommend to use the `!env-var` keyword. In order to use an [environment variable](/getting-started/environment-variable) and not expose a sensitive url into your configuration.

## Example

The request body should look like:

```json
{
  "id": "bccfc69a-9c1b-4ab6-a85e-5d1a722e8778",
  "startTime": "2020-07-18T02:11:37+00:00",
  "name": "Payment API",
  "key": "PAY-API",
  "env": "uat",
  "repository": "restqa/super-test",
  "sha": "0cc25f7f1f0df7d83f5983234801ffcbf4d489a0",
  "duration": 11.988,
  "success": false,
  "durationFormat": "00:00",
  "timestamp": "2020-07-18T02:11:37+00:00",
  "type": "testSuite",
  "total": 2,
  "passed": 0,
  "failed": 2,
  "scenarios": {
    "passed": 0,
    "failed": 4,
    "skipped": 0,
    "undefined": 0
  },
  "features": [
    {
      "keyword": "Feature",
      "line": 1,
      "id": "as-a-user-i-can-manage-my-account",
      "tags": [],
      "uri": "features/test.feature",
      "elements": [
        {
          "id": "as-a-user-i-can-manage-my-account;access-to-my-account-from-the-dashboad-page",
          "keyword": "Scenario",
          "line": 3,
          "name": "Access to my account from the dashboad page",
          "tags": [],
          "type": "scenario",
          "steps": [
            {
              "arguments": [],
              "keyword": "Given ",
              "line": 4,
              "name": "I have the dashboard page",
              "match": {
                "location": "features/setup.js:7"
              },
              "result": {
                "status": "passed",
                "duration": 3009000000
              }
            },
            {
              "arguments": [],
              "keyword": "When ",
              "line": 5,
              "name": "I click on my account",
              "match": {
                "location": "features/setup.js:11"
              },
              "result": {
                "status": "failed",
                "duration": 1000000,
                "error_message": "Error: The button my button hasn't been found\n    at World.<anonymous> (/usr/src/app/features/setup.js:12:9)"
              }
            },
            {
              "arguments": [],
              "keyword": "Then ",
              "line": 6,
              "name": "The title of the page should be \"My account\"",
              "match": {
                "location": "features/setup.js:15"
              },
              "result": {
                "status": "skipped"
              }
            }
          ],
          "step_passed": 1,
          "step_failed": 1,
          "step_skipped": 1,
          "step_undefined": 0,
          "result": false,
          "status": "failed",
          "duration": 3.01,
          "timestamp": "2020-07-18T02:11:37+00:00",
          "metadata": {
            "id": "bccfc69a-9c1b-4ab6-a85e-5d1a722e8778",
            "startTime": "2020-07-18T02:11:37+00:00",
            "name": "Payment API",
            "key": "PAY-API",
            "env": "uat",
            "duration": 11.988,
            "success": false,
            "durationFormat": "00:00"
          }
        },
        {
          "id": "as-a-user-i-can-manage-my-account;access-to-my-account-from-the-menu",
          "keyword": "Scenario",
          "line": 8,
          "name": "Access to my account from the menu",
          "tags": [],
          "type": "scenario",
          "steps": [
            {
              "arguments": [],
              "keyword": "Given ",
              "line": 9,
              "name": "I have the dashboard page",
              "match": {
                "location": "features/setup.js:7"
              },
              "result": {
                "status": "passed",
                "duration": 2969000000
              }
            },
            {
              "arguments": [],
              "keyword": "When ",
              "line": 10,
              "name": "I click on my account",
              "match": {
                "location": "features/setup.js:11"
              },
              "result": {
                "status": "failed",
                "duration": 0,
                "error_message": "Error: The button my button hasn't been found\n    at World.<anonymous> (/usr/src/app/features/setup.js:12:9)"
              }
            },
            {
              "arguments": [],
              "keyword": "Then ",
              "line": 11,
              "name": "The title of the page should be \"My account\"",
              "match": {
                "location": "features/setup.js:15"
              },
              "result": {
                "status": "skipped"
              }
            }
          ],
          "step_passed": 1,
          "step_failed": 1,
          "step_skipped": 1,
          "step_undefined": 0,
          "result": false,
          "status": "failed",
          "duration": 2.969,
          "timestamp": "2020-07-18T02:11:37+00:00",
          "metadata": {
            "id": "bccfc69a-9c1b-4ab6-a85e-5d1a722e8778",
            "startTime": "2020-07-18T02:11:37+00:00",
            "name": "Payment API",
            "key": "PAY-API",
            "env": "uat",
            "duration": 11.988,
            "success": false,
            "durationFormat": "00:00"
          }
        }
      ],
      "total": 2,
      "passed": 0,
      "failed": 2,
      "skipped": 0,
      "undefined": 0,
      "result": false,
      "duration": 5.978999999999999,
      "timestamp": "2020-07-18T02:11:37+00:00",
      "type": "feature",
      "feature_name": "As a user i can manage my account",
      "metadata": {
        "id": "bccfc69a-9c1b-4ab6-a85e-5d1a722e8778",
        "startTime": "2020-07-18T02:11:37+00:00",
        "name": "Payment API",
        "key": "PAY-API",
        "env": "uat",
        "duration": 11.988,
        "success": false,
        "durationFormat": "00:00"
      }
    },
    {
      "keyword": "Feature",
      "line": 1,
      "id": "as-a-user-i-can-manage-my-orders",
      "tags": [],
      "uri": "features/test2.feature",
      "elements": [
        {
          "id": "as-a-user-i-can-manage-my-orders;access-to-my-orders-from-the-dashboad-page",
          "keyword": "Scenario",
          "line": 3,
          "name": "Access to my orders from the dashboad page",
          "tags": [],
          "type": "scenario",
          "steps": [
            {
              "arguments": [],
              "keyword": "Given ",
              "line": 4,
              "name": "I have the dashboard page",
              "match": {
                "location": "features/setup.js:7"
              },
              "result": {
                "status": "passed",
                "duration": 3002000000
              }
            },
            {
              "arguments": [],
              "keyword": "When ",
              "line": 5,
              "name": "I click on my account",
              "match": {
                "location": "features/setup.js:11"
              },
              "result": {
                "status": "failed",
                "duration": 0,
                "error_message": "Error: The button my button hasn't been found\n    at World.<anonymous> (/usr/src/app/features/setup.js:12:9)"
              }
            },
            {
              "arguments": [],
              "keyword": "Then ",
              "line": 6,
              "name": "The title of the page should be \"My account\"",
              "match": {
                "location": "features/setup.js:15"
              },
              "result": {
                "status": "skipped"
              }
            }
          ],
          "step_passed": 1,
          "step_failed": 1,
          "step_skipped": 1,
          "step_undefined": 0,
          "result": false,
          "status": "failed",
          "duration": 3.002,
          "timestamp": "2020-07-18T02:11:37+00:00",
          "metadata": {
            "id": "bccfc69a-9c1b-4ab6-a85e-5d1a722e8778",
            "startTime": "2020-07-18T02:11:37+00:00",
            "name": "Payment API",
            "key": "PAY-API",
            "env": "uat",
            "duration": 11.988,
            "success": false,
            "durationFormat": "00:00"
          }
        },
        {
          "id": "as-a-user-i-can-manage-my-orders;access-to-my-orders-from-the-menu",
          "keyword": "Scenario",
          "line": 8,
          "name": "Access to my orders from the menu",
          "tags": [],
          "type": "scenario",
          "steps": [
            {
              "arguments": [],
              "keyword": "Given ",
              "line": 9,
              "name": "I have the dashboard page",
              "match": {
                "location": "features/setup.js:7"
              },
              "result": {
                "status": "passed",
                "duration": 3007000000
              }
            },
            {
              "arguments": [],
              "keyword": "When ",
              "line": 10,
              "name": "I click on my account",
              "match": {
                "location": "features/setup.js:11"
              },
              "result": {
                "status": "failed",
                "duration": 0,
                "error_message": "Error: The button my button hasn't been found\n    at World.<anonymous> (/usr/src/app/features/setup.js:12:9)"
              }
            }
          ],
          "step_passed": 1,
          "step_failed": 1,
          "step_skipped": 0,
          "step_undefined": 0,
          "result": false,
          "status": "failed",
          "duration": 3.007,
          "timestamp": "2020-07-18T02:11:37+00:00",
          "metadata": {
            "id": "bccfc69a-9c1b-4ab6-a85e-5d1a722e8778",
            "startTime": "2020-07-18T02:11:37+00:00",
            "name": "Payment API",
            "key": "PAY-API",
            "env": "uat",
            "duration": 11.988,
            "success": false,
            "durationFormat": "00:00"
          }
        }
      ],
      "total": 2,
      "passed": 0,
      "failed": 2,
      "skipped": 0,
      "undefined": 0,
      "result": false,
      "duration": 6.009,
      "timestamp": "2020-07-18T02:11:37+00:00",
      "type": "feature",
      "feature_name": "As a user i can manage my orders",
      "metadata": {
        "id": "bccfc69a-9c1b-4ab6-a85e-5d1a722e8778",
        "startTime": "2020-07-18T02:11:37+00:00",
        "name": "Payment API",
        "key": "PAY-API",
        "env": "uat",
        "duration": 11.988,
        "success": false,
        "durationFormat": "00:00"
      }
    }
  ]
}
```

