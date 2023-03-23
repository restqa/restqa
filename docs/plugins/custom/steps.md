---
id: steps
sidebar_label: Step Definition
title: Create your own Given, When & Then steps
parent: custom-plugin
order: 1
---

Hi 👋🏼, 

Before we start, there are some requirements:
- Understand the concept of [step definition](https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/step_definitions.md)
- Understand how to use [cucumber expressions](https://cucumber.io/docs/cucumber/cucumber-expressions/) or Regex

## You feature file

For our example we want to add new step defintion in order to handle the feature file below:

```gherkin
Feature: Bonus calculation based on user's date of birth

Scenario: Calculating user's bonus (> 20 years old)
Given A user born in 1990
When We apply a compute bonus
Then We should have a bonus of 30
```

## Get your plugin ready

```js
const PluginFactory = require("@restqa/plugin");

const myPlugin = new PluginFactory("my-plugin-name");
```

Now we can add your step definitions.

## Given

```js
myPlugin.addGivenStep(
  "A user born in {int}",            // Step definition
  function setYear(yearOfBirth) {   // Handler
    this.user = { yearOfBirth };
  },
  "Set the user's year of birth",   // Description
  ["user", "age"]                   // Tags
)
```

> 🚨 Caution: Handler functions should be function expressions an not arrow expressions.

## Then

We have similar API here:
```js
const { computeBonus } = require("a-third-party-package");

myPlugin.addWhenStep(
  "We apply a compute bonus",                         // Step definition
  function applyComputeBonus() {                      // Handler
    this.bonus = computeBonus(this.user.yearOfBirth);
  },
  "Apply a computeBonus to the user",                 // Description
  ["user", "bonus"]                                   // Tags
)
```

## When

Same for Then steps:
```js
myPlugin.addThenStep(
  "We should have a bonus of {int}",        // Step definition
  function assertBonus(expectedBonus) {     // Handler
    assert(expectedBonus, this.bonus);
  },
  "Check the bonus",                        // Description
  ["user", "bonus"]                         // Tags
)
```

## Api

Your can find the full API documentation in the [`@restqa/plugin` repository](https://github.com/restqa/restqa/tree/master/packages/plugin#api)
