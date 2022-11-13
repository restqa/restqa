Feature: Welcome to the RestQA community

@performance
Scenario: Initial scenario
Given a request hosted on "http://localhost:8000"
When GET "/"
Then status = 200
  And the body:
  """
{
  "hello": "world"
}
  """
