Feature: Example custom step definition

Scenario: Check if file exists
Given a request
When POST "/create-file"
Then status = 200
  And the file "test.txt" exists
  And the body:
  """
{
  "hello": "world"
}
  """
