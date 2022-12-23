Feature: GET /

Scenario: Receive a message containing the query string sent
Given a request
  And the query strings:
  | q | keyword |
When GET "/"
Then status = 200
  And the body:
  """
{
  "message": "The query string received is q = keyword"
}
  """
