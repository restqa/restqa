Feature: POST /

Scenario: Post form data
Given a request
  And the body (form):
  | firstname | john |
  | lastname  | doe  |
When POST "/"
Then status = 200
  And the body:
  """
  {
    "firstname": "john",
    "lastname": "doe"
  }
  """
