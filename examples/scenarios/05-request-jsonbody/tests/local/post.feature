Feature: POST /

Scenario: Use JSON payload
Given a request
  And the payload:
  """
  {
    "firstname": "john",
    "lastname": "doe"
  }
  """
When POST "/"
Then status = 201
  And the body:
  """
  {
    "firstname": "john",
    "lastname": "doe"
  }
  """

Scenario: Use table version
Given a request
  And the body (json):
  | firstname | john |
  | lastname  | doe  |
When POST "/"
Then status = 201
  And the body:
  """
  {
    "firstname": "john",
    "lastname": "doe"
  }
  """

# oups this is not working....
@skip
Scenario: Use File
Given a request
  And the payload from a file "user.json"
When POST "/"
Then status = 201
  And the body:
  """
  {
    "firstname": "john",
    "lastname": "doe"
  }
  """
