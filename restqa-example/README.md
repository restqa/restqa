# RestQA Example 🚀

> A Drive thru example that get your ready quicker than ordering Fast Food 🍔🍟

Hello 👋,

Thank you for your interest on RestQA, let us explain to you what you can find on this folder.

### 📺 Good to know 

RestQA is based on Gherkin / Cucumber and using the .feature files.
It will be bonus for you if you have exposed to the BDD/ATDD practice, it will help you to understand the full vision of RestQA.

## 🗽 Description

This example is a set of test automation scenario that are testing the famous: https://jsonplaceholder.typicode.com
In this exampple we are just sharing the test automation for the `todos` resources. (GET, DELETE, POST, PUT, PATCH)

## 📚 File Structure

This folder is containing a few files:

* `index.js`: The actual microservice code that required to be tested.
* `.restqa.yml`: The RestQA configuration file.
* `tests/unit/get.feature`: Test scenario of the endpoint GET /

## 🎯 Run the example

First you will need to install the dependencies to get the microservice to run properly

```
npm i
```

### 1. Full happiness report

In order to run the test and get a full report available run the command:

```
npm run happy
```

Example of the report:

![report](./assets/restqa-screenshot.png)


### 2. Unit test only

```
npm test
```

![unit-test](./assets/restqa-unit-test.png)

This command will just run the unit test without creating the report, it become handful for dev mode.

---

That it! This is short but this is what RestQA is about, An easy Test Automation sideckick to any microservice.

More information:

* Docs: https://docs.restqa.io
* Website: https://restqa.io
* Twitter: https://twitter.com/restqa
* Linkedin: https://linkedin.com/company/restqa
* Blog: https://medium.com/restqa
* Discord: https://restqa.io/chat
