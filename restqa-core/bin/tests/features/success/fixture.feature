Feature: Fixture to do the functional testing

@unit
Scenario: Scenario all good
Given I have the api gateway
  And I have the path "/"
  And I have the method "GET"
When I run the API
Then I should receive a response with the status 200
  And the response body should be equal to:
  """
{
  "message": "Hello World"
}
  """

@integration
Scenario: Scenario with minimum step for integration tests
Given I have the api gateway
