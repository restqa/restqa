---
id: when
title: "When: Describe your API Event"
sidebar_label: API Trigger (When)
parent: test-creation
order: 2
---

Once your context has been defined you are ready to perform the API request and then get the result.

Then keyword **When** is defined to describe event that need be triggered during the scenario testing.


Example:

```gherkin
When GET "/product"
```

## API Trigger

The supported events are: 


| Event | Description | Mandatory |
| --- | --- | --- |
| [Send](#/documentation/when-send) | Trigger the HTTP API request defined by the given steps | yes |



