---
id: state
sidebar_label: State
title: Share a state between your custom steps and hooks.
parent: custom-plugin
order: 2
---

Hi 👋🏼, 

Before we start, there are some requirements:
- Understand the concept of [state](https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/world.md) (world)

## Get your plugin ready

```js
const PluginFactory = require("@restqa/plugin");

const myPlugin = new PluginFactory("my-plugin-name");
```

## Add a state property

```js
myPlugin.addState("foo", "bar");
```

## Consume state in all your handlers:

```js
myPlugin.addGivenStep(
  "A foo equal to bim",
  function setFoo(newValue) {
    this.state.foo = newValue;
  }
);
```

> 💡 In order to avoid conflict with other plugin state we are recommending to prefix your state property name (example: *myPluginUser* instead of *user* 
