---
id: dataset
title: Dataset
sidebar_label: Dataset 🚧
parent: test-creation
order: 4
---

Dataset is the state storage that you can use in your test.

You can reference a variable from the dataset using the synthax: `{{ my-variable }}`

## Built-in Variable


### {{ response.body }}

Sometime you might want to do multiple call within one scenario, and between theses call you might need to use some values.
Then you can use the built-in variable: `{{ response.body }}` with the dotobject synthax such as:

```gherkin
Scenario: Initial scenario
Given a request
  And the payload:
  """
  {
    "firstname": "john",
    "lastname" : "doe"
  }
  """
When POST "/users"
Then status = 200
  And the body:
  """
{
  "id": 123,
  "firstname": "john",
  "lastname" : "doe"
}
  """
Given a request
When GET "/users/{{ response.body.id }}"
Then status = 200
  And the body:
{
  "id": 123,
  "firstname": "john",
  "lastname" : "doe"
}
  """
```

### {{ response.headers }}

Sometime you might want to do multiple call within one scenario, and between theses call you might need to use some values.
Then you can use the built-in variable: `{{ response.headers }}` with the dotobject synthax such as:

```gherkin
Scenario: Initial scenario
Given a request
  And the payload:
  """
  {
    "firstname": "john",
    "lastname" : "doe"
  }
  """
When POST "/users"
Then status = 200
  And the body:
  """
{
  "id": 123,
  "firstname": "john",
  "lastname" : "doe"
}
  """
Given a request
  the headers:
  | Content-Type     | application/json                        |
  | Accept-Language  | {{ response.headers.content-language }} |
When GET "/users/{{ response.body.id }}"
Then status = 200
  And the body:
{
  "id": 123,
  "firstname": "john",
  "lastname" : "doe"
}
  """
```
