---
id: environment-variable
title: Use Environment variable
parent: getting-started
order: 4
---

In order to avoid credential leaks into your configuration file we recommend you to use environement variables.

## Setting up the environment variables

Each environment variable needs to be represented by the tag into your RestQA configuration file:

`!env-var ENV_VAR` where ENV_VAR is the value need to be replace by an environement variable

Example below:

* We configuring the `slack` output
* Use the webhook url coming from the the `SLACK_WEBHOOK_URL` environement variable


```yaml title=" .restqa.yml"
...
outputs:
 - type: 'slack'
   enabled: true
   config: 
     url: !env-var SLACK_WEBHOOK_URL
     onlyFailed: false
     showErrors: false
```

## Test Execution with environment variables

### Using Bash Export

If you have environment variable expose globally RestQA will read them automatically.

Example below:

* Expose the `SLACK_WEBHOOK_URL` Environment variable into the current bash session
* Execute RestQA test scenario
* The test result wil be exported to the Slack incoming webhook `http://test.exampple.com`

```bash
export SLACK_WEBHOOK_URL=http://test.exampple.com
restqa run
```

### Using Bash Inline

If you have a specific value that you don't want to expose globally you can pass it directly to the RestQA command.

Example below:

* Passing the `SLACK_WEBHOOK_URL` Environement variable into the RestQA command while executing it.
* The test result wil be exported to the slack incoming webhook `http://test.exampple.com`

```bash
SLACK_WEBHOOK_URL=`http://test.exampple.com restqa run
```
