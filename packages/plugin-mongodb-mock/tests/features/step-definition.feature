Feature: Test step definitions

Scenario: Insert and Get information for microservice
Given a mongo collection "users":
  | firstname    | lastname | age | line.displayName | line.id |
  | John         | Doe      | 28  | johndoe          | 123456  |
  | johnny       | doe      | 26  | johnny5          | 45678   |
  And a request
When GET "/users/{{ row.2._id }}"
Then status = 200
  And the body:
  """
  {
    "firstname": "{{ row.2.firstname }}",
    "lastname": "doe",
    "age": "26",
    "line": {
      "id": "{{ row.2.line.id }}",
      "displayName" : "johnny5"
    }
  }
  """

Scenario: Insert then retrieve the data using a casted value
Given a mongo collection "users":
  | firstname    | lastname | age    | line.displayName | line.id[string] |
  | John         | Doe      | 28     | johndoe          | 123456          |
  | johnny       | doe      | 26     | johnny5          | 000009          |
  And a request
When GET "/users?age=26"
Then status = 200
  And the body:
  """
  [{
    "firstname": "{{ row.2.firstname }}",
    "lastname": "doe",
    "age": "26",
    "line": {
      "id": "000009",
      "displayName" : "johnny5"
    }
  }]
  """


Scenario: Insert and Get information for microservice
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

Scenario: Insert and search on nested field
Given a request
  And the payload:
  """
  {
    "firstname": "Ruby",
    "lastname": "Queen",
    "age": "20",
    "line": {
      "id": "0007",
      "displayName" : "spy-9"
    }
  }
  """
When POST "/users"
Then status = 201
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
  | line.id |
  | 0007 |
Then search result "firstname" = "Ruby"
Then search result "lastname" = "Queen"
Then search result "line.displayName" = "spy-9"
Then search result "line.id" = "0007"
Then search result "age" = 20
Then the mongo collection "users" exists

Scenario: Insert and search on multi fields
Given a request
  And the payload:
  """
  {
    "firstname": "Ruby",
    "lastname": "Queen",
    "age": "20",
    "line": {
      "id": "0007",
      "displayName" : "spy-9"
    }
  }
  """
When POST "/users"
Then status = 201
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
  | line.id | age |
  | 0007 | 20 |
Then search result "firstname" = "Ruby"
Then search result "lastname" = "Queen"
Then search result "line.displayName" = "spy-9"
Then search result "line.id" = "0007"
Then search result "age" = 20
Then the mongo collection "users" exists
