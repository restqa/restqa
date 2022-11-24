---
id: json
title: File (Json)
parent: reporting
---


Setting the **FILE** test report is very simple, this report will allow you to create your own visualization from the JSON output.

## Example

```json
{
  "id": "9c0e6f22-f03a-4263-b079-9adcbe090eda",
  "startTime": "2021-02-28T10:52:46+00:00",
  "name": "app",
  "key": "APP",
  "env": "local",
  "duration": 0.766,
  "success": true,
  "durationFormat": "00:00",
  "timestamp": "2021-02-28T10:52:46+00:00",
  "type": "testSuite",
  "total": 1,
  "passed": 1,
  "failed": 0,
  "scenarios": {
    "passed": 1,
    "failed": 0,
    "skipped": 0,
    "undefined": 0
  },
  "features": [
    {
      "keyword": "Feature",
      "line": 1,
      "id": "welcome-to-the-restqa-community",
      "tags": [],
      "uri": "../../../../../src/app/tests/integration/welcome-restqa.feature",
      "elements": [
...

```

## Pre-requisite

 * 1 minute  🚀
 * Valid RestQA configuration file

## Configuration 

```yaml
tests:
  integrations:
  - name: sandbox
    outputs:
      - type: 'file'
        enabled: true
        config: 
          path: 'report.json'
```

### Options

| *Property*   | *Description*                                                                                | *Default*            |
|:-------------|:---------------------------------------------------------------------------------------------|:---------------------|
| `path`       | The filename of the report                                                                   | ./restqa-report.json |


