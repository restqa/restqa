# MongoDB Mock RestQA Plugin

☘️ | Plugin extending the RestQA capability in order to mock all the MongoDB request made by your microservice

> Finally a simple way to use a MongoDB while you test your microservice locally

![banner](https://raw.githubusercontent.com/restqa/restqa/master/packages/plugin-mongodb-mock/assets/mock-mongodb.png)

## Description

### What is the problem this plugin solving?

Microservice architecture is amazing since it helps to keep the atomicity of a services.

However, most of the time microservice are not independent, they will most likely depends on a database.
With this plugin we want to allow you to focus on your test and not writting boring database connection mock.

## Installation

Within your microservice project tested by RestQA, run the following command:

```
npm i -D @restqa/plugin-mongodb-mock
```

***In order to use this library your local machine must have docker installed.***

## Usage

![flow](https://raw.githubusercontent.com/restqa/restqa/master/packages/plugin-mongodb-mock/assets/flow.png)


Let's say you have  microservice connecting to mongoDB:

```js
// index.js
const express = require("express");
const { MongoClient } = require('mongodb');

const {
  PORT,
  MONGODB_URI,
  MONGODB_DBNAME
} = process.env

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  return client.db(MONGODB_DBNAME);
}

main()
  .then(db => {
    express()
      .use(express.json())
      .get('/users/:id', async (req, res) => {
        const search = {
          'line.id': req.params.id
        }
        const result = await db.collection('users').findOne(search)
        delete result._id
        res.json(result);
      })
      .listen(PORT || 3011)
  })
  .catch(console.error)
```

Your RestQA test will look like:

```gherkin
Scenario: Insert and Get information for microservice
Given a mongo collection "users":
  | firstname    | lastname | age | line.displayName | line.id |
  | John         | Doe      | 28  | johndoe          | 123456  |
  | johnny       | doe      | 26  | johnny5          | 45678   |
  And a request
When GET "/users/45678"
Then status = 200
  And the body:
  """
  {
    "firstname": "johnny",
    "lastname": "doe",
    "age": "26",
    "line": {
      "id": "45678",
      "displayName" : "johnny5"
    }
  }
  """
```

> ⚠️ Important! You need to use environement variable to manage your connection to the mongodb Database. The mongodb-mock-plugin will override the connection environement variable accordingly.

In your existing `.restqa.yml` under plugins section, add the following:

```yaml
...
plugins:
- name: "@restqa/plugin-mongodb-mock
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
specification:
  tool: swagger
plugins:
- name: "@restqa/plugin-mongodb-mock"
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
Scenario: GET -  Insert and Get information for microservice
Given a mongo collection "users":
  | firstname    | lastname | age | line.displayName | line.id |
  | John         | Doe      | 28  | johndoe          | 123456  |
  | johnny       | doe      | 26  | johnny5          | 45678   |
  And a request
When GET "/users/45678"
Then status = 200
  And the body:
  """
  {
    "firstname": "johnny",
    "lastname": "doe",
    "age": "26",
    "line": {
      "id": "45678",
      "displayName" : "johnny5"
    }
  }
  """
 
Scenario: POST -  Insert and Get information for microservice
Given a request
  And the payload:
  """
  {
    "firstname": "Julia",
    "lastname": "Queen",
    "age": "23",
    "line": {
      "id": "0009",
      "displayName" : "spy-7"
    }
  }
  """
When POST "/users"
Then status = 201
When search in mongo collection "users":
  | firstname |
  | Julia |
Then search result "firstname" = "Julia"
Then search result "lastname" = "Queen"
Then search result "line.displayName" = "spy-7"
Then search result "line.id" = "0009"
Then search result "age" = 23
Then the mongo collection "users" exists
```

#### Given

```gherkin
Given a mongo collection {string}:
| field1  | field2 |
| value2  | value2 |

# Example
Given a mongo collection "users":
| firstname    | lastname | age |
| john         | doe      | 26  |
| christiano   | ronaldo  | 32  |

# Using dot syntax for cascading values:

Given a mongo collection "users":
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

*** Each entry will aslo be available in the data state, example if you want to access to an inserted id you can use the reference `{{ row.1._id }}`***

Example:

```gherkin
Feature: DELETE /customers/:id

Scenario: Delete a specific Customer
Given a mongodb collection "customers":
  | firstname    | lastname |
  | John         | Doe      |
  And a request
When GET "/customers/{{ row1._id }}"
Then status = 200
  And the body:
  """
  {
    "id": "{{ row.1._id }}",
    "firstname": "{{ row.1.firstname }}",
    "lastname": "{{ row.1.lastname }}"
  }
  """
```


#### When

The `When` keyword will trigger action to perform in you MongoDB sandbox

```gherkin
When search in mongo collection {string}:
| query field1 | query field2 |
| query value1 | query value2 |

# Example if we want to search an entry containing:  firstname = John
When search in mongo collection "users":
  | firstname |
  | John |
```

#### Then

The `Then` keyword will after different asssertion that you want do in your mongoDB Sandbox.

```gherkin
# Asserting the result from a previous search
Then search result {string} = {string}
Then search result {string} = {float}

# Example
Then search result "firstname" = "John"
```

```gherkin
# Check if a collection exist in the mongoDB database
Then the collection {string} exists

# Example
Then the collection "users" exists
```
