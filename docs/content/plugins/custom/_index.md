---
id: custom-plugin
title: Custom
sidebar_label: Build your own
order: 1
parent: plugins
---

## Introduction

As we mentioned earlier, RestQA is based on [Cucumber](https://cucumber.io/). Then, you can create your own step definitions directly in your project.

There are some requirements:
- Understand the concept of [step definition](https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/step_definitions.md)
- Understand how to use [cucumber expressions](https://cucumber.io/docs/cucumber/cucumber-expressions/) or Regex

## Write your first step definition

Then, there a two steps to write your own step definition:

### Create a .js file in your project

For example, let's create a `embedded-plugin.js` file

```js
// Import the plugin factory package
const PF = require("@restqa/plugin");

// Your imports
const { compute } = require("../somewhere-in-you-app");

// Create your plugin factory instance
const plugin = new PF("plugin-name");

plugin.addWhenStep(
  "I use my custom compute in {string} mode", // title
  function(mode) { // handler
      this.result = compute({ mode });
  },
  "Compute in a specific mode and assign result to this.result", // description
  ["compute"] // tags
);

plugin.addThenStep(
  "The result of compute should be {int}",
  function (expectedResult) {
    assert.equal(this.result, expectedResult)
  },
  "Assert this.result value"
);

module.exports = plugin; // `export default` plugin in ESM
```

### Map this file into you `.restqa.yml` config file

```yml
plugins:
  - name: test
    plugins:
      - name: "../path/embedded-plugin.js"
        config:
          foo: bar 
```

### 🍹 Enjoy your new step definition

You can use RestQA cli to check if the steps are well available.

```bash
$ restqa steps when
```

If you want to filter the result by your plugin name: 

```bash
$ restqa steps when -t plugin-name
```

### Expose it to the world 🌍

Once your confident with your plugin you can expose it through Node.Js module.

Once your package is published, you just have to import it into your project and update the config file:

```yml
plugins:
  - name: "package-name" # instead of path
    config:
      foo: bar 
```

Feel free to share it with us on [discord](https://restqa.io/chat) 🙌
