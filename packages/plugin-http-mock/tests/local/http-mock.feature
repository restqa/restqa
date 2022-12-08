Feature: Example to test the plugin

Scenario: Mock the api.github.com
Given a request
When GET "/info"
Then status = 200
  And the body:
  """
  {
    "message": "Hello World!"
  }
  """

Scenario: Mock the api.github.com with specific query string
Given a request
  And the query strings: 
  | foo | bar |
When GET "/info"
Then status = 201
  And the body:
  """
  {
    "message": "Hello World with query parameters!"
  }
  """

