---
id: performance-testing
title: Performance testing
sidebar_label: 🏋️ Performance Testing
order: 8
---

I think you'll agree with me when I say:

It's **REALLY** hard to maintain load test scenario.

This is why RestQA is offering you the way to maintain them for you by reusing your Gherkin scenario. And translate them into a your favorite load testing tool scenario 🤗.

### 1. Select the scenario to be translated to a performance test

Firstly, you need to have a few scenario written in the gherkin format.
And then you simple need to add the tag `@perfomance` on top of each scenario that you want to reuse for your performance test.

Example: 
```gherkin title="tests/integration/get-product.feature" {1-1}
@performance
Scenario Outline: The product doesn't exist into the database
Given a request
  And the headers:
    | accept-language | en |
    | content-type    | application/json |
When GET "/api/products/111111"
Then status = 200
  And the response time < 100 ms
  And  "message" = "hello world"
```

When we wiil run the test RestQA will detect the tag and translate the current scenario into your load testing scenario format.


### 2. Define your load testing tool

In order to define your testing tool you will need to specify it under the `tests.performance` plugin section.
Example:

```yaml {13-14} title=".restqa.yml"
---
version: 0.0.1
metadata:
  code: EXAMPLE-RESTQA
  name: Example Restqa
  description: Delicious Microservice example maintained with RestQA
tests:
  unit:
    port: 8887
    command: npm run dev
  performance:
    tool: artillery
    outputFolder: tests/performances
    onlySuccess: false

```

As you can see we just need to specify the name of the tool that you are using to run your performance test.

#### Options

Under the `performance` setting a few option are available:

| *Property*                       | *Description*                                                                                            | *Required* | *Default*           |
|:---------------------------------|:---------------------------------------------------------------------------------------------------------|------------|:--------------------|
| `tests.performance.tool`         | The tool that you plan to use for your load testing                                                      | Yes        |                     |
| `tests.performance.outputFolder` | Specify the folder where the scenario should be generated                                                | No         | `tests/performance` |
| `tests.performance.onlySuccess`  | Define if you want to generate the performance scenario only for the functional scenario that passed     | No         | `true`              |


### 3. Generate the performance test scenario

Once the configuration has been setup, everytime you will launch the test using the command:

```bash
restqa run --report
```

This will generate the expected performance scenario respection the format of your performance test tool.

*Tips: If you just want to run to generate the performance scenario without running the full suite of test, use the command:*

```bash
restqa run -t @performance
```

### 4. Run your performance test

Once your performance test scenario has been generated, the last step for you is just to reuse those scenarios into your favorite performance test and voila 🎉!
