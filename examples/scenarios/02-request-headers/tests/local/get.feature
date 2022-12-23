Feature: GET /

Scenario: receive a message containing the header sent
Given a request
  And the headers:
  | x-api-key | xxx-yyy-zzz |
When GET "/"
Then status = 200
  And the body:
  """
{
  "message": "The receive header x-api-key is: xxx-yyy-zzz"
}
  """
