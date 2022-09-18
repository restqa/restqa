@coucou
Feature: GET /

@performance
Scenario: Successfull hello world
Given I have the api gateway
  And I have the path "/"
  And I have the method "GET"
When I run the API
Then I should receive a response with the status 200
  And the response body should be equal to:
  """
{
  "hello": "world"
}
  """

Scenario: Non successfull
Given I have the api gateway
  And I have the path "/"
  And I have the method "GET"
When I run the API
Then I should receive a response with the status 201
  And the response body should be equal to:
  """
{
  "hello": "world"
}
  """
