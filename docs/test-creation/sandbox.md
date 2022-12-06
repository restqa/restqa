---
id: sandbox
title: "Need to write test faster? Do this!"
sidebar_label: Test generation
parent: test-creation
order: 4
video: https://www.youtube.com/watch?v=2q0HXwC3fZQ
pre-requisit:
  - cli
---

Everyone do not like to write the test scenario, before end...
Sometimes it feels good to just code our feature and figure out the testing part later...
With RestQA no need to be guilty anymore we are here to support you on that journey.

## What is the sandbox?

The sansbox is the place where you can play with your microservice and RestQA will simply observe the traffic
between you and your microservice in order to generate a few tests scenario for you.

And you know what it's dead simple!

## Getting started

First you need to have your RestQA project setup (folder should include the `.restqa.yml`)

And then simply run the command

```bash
restqa sandbox
```

From there the proxy serveer will start with the following message:

```bash
> The Sandbox is ready 🦏
> Generate test scenario just by sending API request to: http://localhost:8888
> Example: curl -X GET http://localhost:8888
> Example to save scenario in file: curl -X GET -H "x-restqa-scenario: name of my scenario" http://localhost:8888
--
> To exit, press Ctrl+C
```

## Test Scenario Generation

From there you can start playing with your microservice using the PORT shared on the console by RestQA.

Your test scenario will be generated and available on the console.

Example:

![sandbox-example](images/documentation/restqa-sandbox.gif)



## Save generated Test Scenario

If you are read to save one test scenario you can just add the header `x-restqa-scenario` to your request.
Then RestQA will automatically save the scenario into your "tests/local" folder


![sandbox-example-save](images/documentation/restqa-sandbox-save.gif)

And voila!
