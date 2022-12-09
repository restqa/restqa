# Plugin Faker

> Generate fake data for Test Scenarios

### Introduction

Are you not fed up of using John Doe in your test automation? 😆 

Or What will be the behavior of your product on the production while using real data?

It's a good question right? The best way to answer is to start thinking of having test scenario that are using different data each time.

This should help you on doing more exploration testing... It's exactly how this plugin want to help you.

Once installed this plugin will extend the RestQA capability in order to generate fake data on your scenario.

This plugins is based on the [faker.js](https://github.com/Marak/faker.js) library

## Usage

The data state from RestQA are support the following pattern `{{ my-date }}`, everytime your will use this pattern,
The information will be replace by the actual value at the runtime.

Now when it comes to fake data on you installed the plugin you will just need to add the prefix `faker` such as `{{ faker.name.lastName }}`

Example: 

```gherkin
Scenario: Generate Fake data (defaul language)
Given a request
  And the query strings:
  | music | {{ faker.music.genre }} |
When GET "/info"
Then status = 200
```

While `faker.music.genre` is refering the to property `music.genre` from the [Faker.js](https://github.com/Marak/faker.js) library. ([full list properties available](https://github.com/Marak/faker.js#api-methods))

## Getting Started

```bash
npm i -D @restqa/faker-plugin
```

Then in your `.restqa.yml` configuration file you will need to add the follow snippet under the `environments.*.plugins` section:

```yaml
version: 0.0.1
metadata:
  code: RESTQA-FAKER
  name: "@restqa/plugin-faker"
  description: An amazing test to handle plugin faker
tests:
  local:
    port: "3013"
    command: npm run dev

plugins:
  - name: "@restqa/plugin-faker
    config:
      locale: "en"
```

## Options

| *Variable*               | *Description*                                                                                                       | *Default*          |
|:-------------------------|:--------------------------------------------------------------------------------------------------------------------|:-------------------|
| `locale`                 | The local to use in order to generate fake data [available values](https://github.com/Marak/Faker.js#Localization)  | `en`               |
