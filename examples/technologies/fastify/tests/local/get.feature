Feature: Welcome to the RestQA community

Scenario: Initial scenario
Given a request
When GET "/"
Then status = 200
  And the body:
  """
{
  "hello": "world"
}
  """