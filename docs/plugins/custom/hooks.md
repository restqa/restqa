---
id: hooks
sidebar_label: Hooks
title: Create your own Before, BeforeAll, After & AfterAll hooks
parent: custom-plugin
order: 3
---

Hi 👋🏼, 

Before we start, there are some requirements:
- Understand the concept of [hooks](https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/hooks.md)

## Get your plugin ready

```js
const PluginFactory = require("@restqa/plugin");

const myPlugin = new PluginFactory("my-plugin-name");
```

## Before

There are three different interfaces:

```js
myPlugin.addBeforeHook(
  function resetUser() {
    this.user = {};
  }
);
```

or

```js
myPlugin.addBeforeHook(
  "@resetUser"
  function resetUser() {
    this.user = {};
  }
);
```

or 

```js
myPlugin.addBeforeHook(
  { tags: "@resetUser" }
  function resetUser() {
    this.user = {};
  }
);
```

## After

We can use the same interfaces than After:

```js
myPlugin.addAfterHook(
  function resetBonus() {
    this.bonus = null;
  }
);
```

or

```js
myPlugin.addAfterHook(
  "@resetBonus",
  function resetBonus() {
    this.bonus = null;
  }
);
```

or

```js
myPlugin.addAfterHook(
  { tags: "@resetBonus" },
  function resetBonus() {
    this.bonus = null;
  }
);
```

## BeforeAll

```js
myPlugin.addBeforeAllHook(
  function resetBonus() {
    this.bonus = null;
  }
);
```

> 💡 We can't use tags with `addBeforeAllHook` hook

## AfterAll

```js
myPlugin.addAfterAllHook(
  function resetUser() {
    this.user = {};
  }
);
```

> 💡 We can't use tags with `addAfterAllHook` hook
