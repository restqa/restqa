---
id: test-creation
title: 🎯 Test creation (gherkin)
sidebar_label: 🎯 Test creation
order: 5
---

Test creation are based on the Agnostic Language: Gherkin.
The key benefit of using Gherkin is that you will be able to re-use your test regardless the implementation language of your microservices.

In order to undertand better the best way to write scenario, you should first be comfortable with cucumber, take a look at the [cucumber documentation](https://cucumber.io/docs/gherkin/reference/) to fully understand the diifferent definition on the current page.

## Example:

### GET method

```gherkin
Scenario: Get details of the users
Given a request
  And the headers:
    | accept-language | en |
    | content-type    | application/json |
When GET "/api/users/12345"
Then status = 200
  And body:
  """
  {
    "lastName": "John",
    "firstName": "Doe"
  }
  """
```

### POST method

```gherkin
Scenario: Create a user
Given a request
  And the headers:
    | content-type    | application/json |
  And the payload:
  """
  {
    "firstname": "john",
    "lastname": "doe"
  }
  """
When POST "/api/users"
Then status = 201
  And the response time < 100 ms
  And "message" = "hello world"
  And body:
  """
  {
    "id": 101,
    "lastName": "John",
    "firstName": "Doe"
  }
  """
```

### PUT method

```gherkin
Scenario: Update a user
Given a request
  And the headers:
    | content-type    | application/json |
  And the payload:
  """
  {
    "firstname": "johnny",
    "lastname": "doe"
  }
  """
When POST "/api/users/101"
Then status = 201
  And the response time < 100 ms
  And body:
  """
  {
    "id": 101,
    "lastName": "johnny",
    "firstName": "doe"
  }
  """
```

### PATCH method

```gherkin
Scenario: Partially update a user
Given a request
  And the headers:
    | content-type    | application/json |
  And the payload:
  """
  {
    "lastname": "doe"
  }
  """
When POST "/api/users/101"
Then status = 201
  And the response time < 100 ms
  And body:
  """
  {
    "id": 101,
    "lastName": "johnny",
    "firstName": "doe"
  }
  """
```

### DELETE method

```gherkin
Scenario: Delete a user
Given a request
When DELETE "/api/users/101"
Then status = 204
```


### Chaining 🚀

```gherkin
Scenario: Create, get then a delete user
Given a request
  And the headers:
    | content-type    | application/json |
  And the payload:
  """
  {
    "firstname": "john",
    "lastname": "doe"
  }
  """
When POST "/api/users"
Then status = 201
  And the response time < 100 ms
  And "message" = "hello world"
  And body:
  """
  {
    "id": 101,
    "lastName": "John",
    "firstName": "Doe"
  }
  """
Given a request
  And the headers:
    | accept-language | en |
    | content-type    | application/json |
When GET "/api/users/12345"
Then status = 200
  And body:
  """
  {
    "lastName": "John",
    "firstName": "Doe"
  }
  """
Given a request
When DELETE "/api/users/101"
Then status = 204
```

## Tags

### @skip

Skip the actual scenario

At the Scenario level: 

```gherkin

@skip
Scenario: This Scenario will be skipped
Given a request
...
```

At the Feature level: 

```gherkin

@skip
Feature: All the scenario in this feature will be skipped

Scenario: I will be skipped
Given a request
...


Scenario: I will be skipped as well
Given a request
...
```

### @wip

Define the current scenario as work in progress. (alias @skip)

At the Scenario level: 

```gherkin

@wip
Scenario: This Scenario will be skipped 
Given a request
...
```

At the Feature level: 

```gherkin

@wip
Feature: All the scenario in this feature will be skipped

Scenario: I will be skipped
Given a request
...


Scenario: I will be skipped as well
Given a request
...
```

### @insecure

On some case, the api call might face some ssl validation issue, in ordert ignore the ssl certificate validity you can use the tag `@insecure`

At the Scenario level: 

```gherkin

@insecure
Scenario: This scenario will ignore the ssl certificate
Given a request
...
```

At the Feature level: 

```gherkin

@insecure
Feature: All the scenario in this feature will ignore the ssl certificate

Scenario: I will ignore the ssl certificate
Given a request
...


Scenario: I will ignore the ssl certificate  as well
Given a request
...
```
