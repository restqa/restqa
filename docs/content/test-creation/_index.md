---
id: test-creation
title: 🎯 Test creation (gherkin)
sidebar_label: 🎯 Test creation
order: 5
---

Test creation are based on the Agnostic Language: Gherkin.
The key benefit of using Gherkin is that you will be able to re-use your test regardless the implementation language of your microservices.

In order to undertand better the best way to write scenario, you should first be comfortable with cucumber, take a look at the [cucumber documentation](https://cucumber.io/docs/gherkin/reference/) to fully understand the diifferent definition on the current page.

## Tags

### @skip

Skip the actual scenario

At the Scenario level: 

```gherkin

@skip
Scenario: This Scenario will be skipped
Given I have the api gateway
...
```

At the Feature level: 

```gherkin

@skip
Feature: All the scenario in this feature will be skipped

Scenario: I will be skipped
Given I have the api gateway
...


Scenario: I will be skipped as well
Given I have the api gateway
...
```

### @wip

Define the current scenario as work in progress. (alias @skip)

At the Scenario level: 

```gherkin

@wip
Scenario: This Scenario will be skipped 
Given I have the api gateway
...
```

At the Feature level: 

```gherkin

@wip
Feature: All the scenario in this feature will be skipped

Scenario: I will be skipped
Given I have the api gateway
...


Scenario: I will be skipped as well
Given I have the api gateway
...
```

### @insecure

On some case, the api call might face some ssl validation issue, in ordert ignore the ssl certificate validity you can use the tag `@insecure`

At the Scenario level: 

```gherkin

@insecure
Scenario: This scenario will ignore the ssl certificate
Given I have the api gateway
...
```

At the Feature level: 

```gherkin

@insecure
Feature: All the scenario in this feature will ignore the ssl certificate

Scenario: I will ignore the ssl certificate
Given I have the api gateway
...


Scenario: I will ignore the ssl certificate  as well
Given I have the api gateway
...
```


