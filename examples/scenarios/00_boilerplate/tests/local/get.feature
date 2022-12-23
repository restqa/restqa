Feature: GET /

Scenario: Main route
Given a request
When GET "/"
Then status = 200
  And the body:
  """
{
  "hello": "world"
}
  """
