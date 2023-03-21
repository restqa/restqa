Feature: Casting context data

Scenario: Insert and Get information for microservice (number)
Given a mongo collection "users":
  | firstname    | lastname | age[number] | line.displayName | line.id[number] |
  | John         | Doe      | 28          | johndoe          | 123456          |
  | johnny       | doe      | 26          | johnny5          | 45678           |
  And a request
When GET "/users/{{ row.2._id }}"
Then status = 200
  And the body:
  """
  {
    "id": "{{ row.2._id }}",
    "firstname": "{{ row.2.firstname }}",
    "lastname": "doe",
    "age": 26,
    "line": {
      "id": {{ row.2.line.id }},
      "displayName": "johnny5"
    }
  }
  """

Scenario: Insert and Get information for microservice (boolean)
Given a mongo collection "users":
  | firstname    | lastname | age[number] | line.displayName | line.active[boolean] |
  | John         | Doe      | 28          | johndoe          | true                 |
  | johnny       | doe      | 26          | johnny5          | false                |
  And a request
When GET "/users/{{ row.1._id }}"
Then status = 200
  And the body:
  """
  {
    "id": "{{ row.1._id }}",
    "firstname": "{{ row.1.firstname }}",
    "lastname": "Doe",
    "age": 28,
    "line": {
      "displayName" : "johndoe",
      "active": true
    }
  }
  """
Given a request
When GET "/users/{{ row.2._id }}"
Then status = 200
  And the body:
  """
  {
    "id": "{{ row.2._id }}",
    "firstname": "{{ row.2.firstname }}",
    "lastname": "doe",
    "age": 26,
    "line": {
      "displayName" : "johnny5",
      "active": false
    }
  }
  """

@skip 
Scenario: Insert and Get information for microservice (array)
Given a mongo collection "users":
  | firstname    | lastname | age[number] | line.displayName | line.roles[boolean] |
  | John         | Doe      | 28          | johndoe          | true                |
  | johnny       | doe      | 26          | johnny5          | false               |
  And a request
When GET "/users/{{ row.1._id }}"
Then status = 200
  And the body:
  """
  {
    "id": "{{ row.1._id }}",
    "firstname": "{{ row.1.firstname }}",
    "lastname": "Doe",
    "age": 28,
    "roles": [
      "one",
      "two",
      "three"
    ]
  }
  """

Scenario: Insert and Get information for microservice (null)
Given a mongo collection "users":
  | firstname    | lastname | age[number] | line.displayName | line.roles[boolean] |
  | John         | Doe      | 28          | null             | true                |
  | johnny       | doe      | 26          | johnny5          | false               |
  And a request
When GET "/users/{{ row.1._id }}"
Then status = 200
  And the body:
  """
  {
    "id": "{{ row.1._id }}",
    "firstname": "{{ row.1.firstname }}",
    "lastname": "Doe",
    "age": 28,
    "line": {
      "displayName" : null,
      "roles": true
    }
  }
  """

Scenario: Insert and Get information for microservice (datetime)
Given a mongo collection "users":
  | firstname    | lastname | age[number] | line.displayName | line.roles[boolean] | createdAt[Date] |
  | John         | Doe      | 28          | null             | true                | 2012-09-01       |
  | johnny       | doe      | 26          | johnny5          | false               | 2015-10-01       |
  And a request
When GET "/users/{{ row.1._id }}"
Then status = 200
  And the body:
  """
  {
    "id": "{{ row.1._id }}",
    "firstname": "{{ row.1.firstname }}",
    "lastname": "Doe",
    "age": 28,
    "line": {
      "displayName" : null,
      "roles": true
    },
    "createdAt": "2012-09-01T00:00:00.000Z"
  }
  """
  
Scenario: Insert and Get information for microservice (timestamp)
Given a mongo collection "users":
  | firstname    | lastname | age[number] | line.displayName | line.roles[boolean] | createdAt[timestamp] |
  | John         | Doe      | 28          | null             | true                | 1531456567           |
  | johnny       | doe      | 26          | johnny5          | false               | 2015-10-01           |
  And a request
When GET "/users/{{ row.1._id }}"
Then status = 200
  And the body:
  """
  {
    "id": "{{ row.1._id }}",
    "firstname": "{{ row.1.firstname }}",
    "lastname": "Doe",
    "age": 28,
    "line": {
      "displayName" : null,
      "roles": true
    },
    "createdAt": {
      "$timestamp": "1531456567"
    }
  }
  """
