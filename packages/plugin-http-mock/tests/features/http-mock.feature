Feature: Example to test the plugin

Scenario: Mock the api.github.com
Given I start a server
When I GET "/info"
Then the status code should be 200
  And the response body should be:
  """
  {
    message: "Hello World!"
  }
  """

Scenario: Mock the api.github.com with specific query string
Given I start a server
When I GET "/info?foo=bar"
Then the status code should be 201
  And the response body should be:
  """
  {
    message: "Hello World with query parameters!"
  }
  """

