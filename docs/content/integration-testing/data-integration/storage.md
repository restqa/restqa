---
id: storage
sidebar_label: File system
title: File system
parent: data-integration
---

While writting your test scenario you might need to interact with the file system.

In order to control the access to your file system, RestQA only access the folder that you specify in the configuration file.
The path to the folder needs to be relative path from your `.restqa.yml` file location.

## Usage

The example below we are defining our **storage folder** as `tests/integration/data`.
This is the folder where we decided to store all the file that we need to use during the test scenario execution.

```yaml {11-12} title=".restqa.yml" 
---

version: 0.0.1
metadata:
  code: SAMPLE
  name: Sample running on example.com
  description: E2E test of the public api
tests:
  integrations:
  - name: sandbox
    default: true
    data:
      storage: 'tests/integration/data'
```

Then we can imagine that we create the file:

```json title="test/integration/data/my-body.json" 
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe"
}
```

Finally we are able to reuse from some step definition that requires access to the file system such as:

```gherkin {2-2}
Given I have the api gateway
  And the payload from a file stored at "my-body.json"
When I run the API
```
