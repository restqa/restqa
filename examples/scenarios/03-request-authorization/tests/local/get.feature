Feature: GET /

Scenario: Print get the bearer on the response
Given a request
  And the bearer token "xxx-yyy-zzz"
When GET "/authorization"
Then status = 200
  And the body:
  """
{
  "message": "The Authorization header received is: Bearer xxx-yyy-zzz"
}
  """

Scenario: Print get the basic on the response
Given a request
  And the basic auth "foo" / "bar"
When GET "/authorization"
Then status = 200
  And the body:
  """
{
  "message": "The Authorization header received is: Basic Zm9vOmJhcg=="
}
  """
Given a request
  And the basic auth "bar" / "foo"
When GET "/authorization"
Then status = 200
  And the body:
  """
{
  "message": "The Authorization header received is: Basic YmFyOmZvbw=="
}
  """
