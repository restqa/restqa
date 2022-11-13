Feature: Fixture to do the functional testing

@unit
Scenario: Scenario all good
Given a request
When GET "/"
Then status = 200
  And the body:
  """
{
  "message": "Hello World"
}
  """

@integration
Scenario: Scenario with minimum step for integration tests
Given a request
