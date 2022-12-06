# MongoDB Mock RestQA Plugin

☘️ | Plugin extending the RestQA capability in order to mock all the MongoDB request made by your microservice

> Finally a simple way to use a MongoDB while you test your microservice locally

![banner](https://raw.githubusercontent.com/restqa/restqa/master/packages/plugin-mongodb/assets/mock-mongodb.png)

## Description

### What is the problem this plugin solving?

Microservice architecture is amazing since it helps to keep the atomicity of a services.

However, most of the time microservice are not independent, they will most likely depends on a database.
With this plugin we want to allow you to focus on your test and not writting boring database connection mock.

## Installation

Within your microservice project tested by RestQA, run the following command:

```
npm i @restqa/mongodb-mock-plugin
```

***In order to use this library your local machine must have docker installed.***

## Usage

![flow](https://raw.githubusercontent.com/restqa/restqa/master/packages/plugin-mongodb/assets/flow.png)


Let's say you have  microservice connecting to mongoDB:

```js
// index.js
const { MongoClient } = require('mongodb');
const express = require('express');

const url = process.env.MONGODB_URI; // Use environement variable
const dbName = process.env.MONGODB_DBNAME; // Use environment variable
async function main() {
  const client = new MongoClient(url);
  await client.connect();
  return client.db(dbName);
}

main()
  .then(db => {
    express()
      .get('/users', async (req, res) => {
        const results = await db.collection('users').find({}).toArray();
        res.json(results);
      })
      .listen(3000)
  })
  .catch(console.error)

```

Your RestQA test will look like:

```gherkin
Given I insert in the collection "users":  # Insert mock Data in the sandbox mongoDB
  | firstname    | lastname | person.age |
  | john         | doe      | 26         |
Given I have the api gateway # Run the microservice test locally
  And I have the path "/users"
  And I have the method "GET"
When I run the API
Then I should receive a response with the status 200
  And the response body should be equal to: #return the data from the database.
  """
[{
  "firstname": "john",
  "lastname": "doe",
  "person": {
    "age": 26,
  }
}]
  """
```



> ⚠️ Important! You need to use environement variable to manage your connection to the mongodb Database. The mongodb-mock-plugin will override the connection environement variable accordingly.

In your existing `.restqa.yml` under plugins section, add the following:

```yaml
...
plugins:
- name: "@restqa/mongodb-mock-plugin"
  config:
    debug: false
    envVarName:
      uri: 'MONGODB_URI'
      dbName: 'MONGODB_DBNAME'
    mongodb:
      version: '6.0.2'
 ...
```
Voila... A couple of line and your endpoint is tested 🚀

### Options

| *Variable*          | *Description*                                                                               | *Default*        |
|:------------------- |:--------------------------------------------------------------------------------------------|:-----------------|
| `debug   `          | Help you to debug the behavior of the plugin by printing information into the console       | `false`          |
| `envVarName.uri`    | The environement name that contains the MONGODB URI use in the microservice code            | `MONGODB_URI`    |     
| `envVarName.dbName` | The environement name that contains the MONGODB DATABASE NAME use in the microservice code  | `MONGODB_DBNAME` |     
| `mongodb.version`   | The version of mongoDB that need to be used during the tests                                | `latest`         |     


Example of a complete `.restqa.yml`: 

```yaml
# .restqa.yml
---
version: 0.0.1
metadata:
  code: EXAMPLE-RESTQA
  name: Example Restqa
  description: Delicious Microservice example maintained with RestQA
tests:
  local:
    port: 8887
    command: npm run dev
    data: {}
  performance:
    tool: artillery
    outputFolder: tests/performances
    onlySuccess: false
specification:
  tool: swagger
plugins:
- name: "@restqa/mongodb-mock-plugin"
  config:
    debug: false
    envVarName: 'MONGODB_URI',
    mongodb:
      version: '6.0.2'
```

Then from there be sure you in your microservice you use the environement variable  `MONGODB_URI`  and `MONGODB_DBNAME` in your code such as:

```js
import { MongoClient } from 'mongodb'

// Connection URL
async function main() {
  const url = process.env.MONGODB_URI; // Use an environement variable then RestQA can override it during testing
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db(process.env.MONGODB_DBNAME); // Use an environement variable then RestQA can override it during testing
  ...

```

## Available step definition

#### Full example

```gherkin
Given I insert in the collection "users":
  | firstname    | lastname | person.age |
  | john         | doe      | 26  |
  | christiano   | ronaldo  | 32  |
When I search in the collection "users":
  | firstname    |
  | john         |
Then the result of the search at "firstname" should equal "John"
Then the result of the search at "lastname" should equal "doe"
Then the result of the search at "person.age" should equal 26
Then the db collection "users" exists
```

#### Given

```gherkin
Given I insert in the collection {string}:
| field1  | field2 |
| value2  | value2 |

# Example
Given I insert in the collection "users":
| firstname    | lastname | age |
| john         | doe      | 26  |
| christiano   | ronaldo  | 32  |

# Using dot syntax for cascading values:

Given I insert in the collection "users":
| firstname    | lastname | person.age |
| john         | doe      | 26         |

# Should create the object like:
# {
#   "firstname": "john",
#   "lastname": "doe",
#   "person": {
#     "age": 26
#   }
# }
```

#### When

The `When` keyword will trigger action to perform in you MongoDB sandbox

```gherkin
When I search in the collection {string}:
| query field1 | query field2 |
| query value1 | query value2 |

# Example if we want to search an entry containing:  firstname = John
When I search in the collection "user":
  | firstname |
  | John |
```

#### Then

The `Then` keyword will after different asssertion that you want do in your mongoDB Sandbox.

```gherkin
# Asserting the result from a previous search
Then the result of the search at {string} should equal {string}
Then the result of the search at {string} should equal {float}

# Example
Then the result of the search at "firstname" should equal "John"
```

```gherkin
# Check if a collection exist in the mongoDB database
Then the db collection {string} exists

# Example
Then the db collection "user" exists
```
