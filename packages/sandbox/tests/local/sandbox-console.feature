Feature: Generate a Test Scenario (console)

Scenario: Get the sandbox to start
Given the upstream path "GET" "/devices" should respond:
  """
  {
    "foo": "bar"
  }
  """
When upstream starts on port 9999
Given a request
When GET "/devices"
  And upstream stops
Then the console print:
  """
> The Sandbox is ready 🦏
> Generate test scenario just by sending API request to: http://localhost:3001
> Example: curl -X GET http://localhost:3001
> Example to save scenario in file: curl -X GET -H "x-restqa-scenario: name of my scenario" http://localhost:3001
--
> To exit, press Ctrl+C
  """

Scenario: initial scenario
Given the upstream path "GET" "/devices" should respond:
  """
  {
    "foo": "bar"
  }
  """
When upstream starts on port 9999
Given a request
When GET "/devices"
  And upstream stops
Then status = 200
  And the body:
  """
{
  "foo": "bar"
}
  """
  And the file "tests-generated/local/GET_devices.feature" not exists
  And the console print:
  """
  ------------------------------------------
  New Test Scenarion generated 🚀🚀🚀
  ------------------------------------------
  Given a request
  When GET "/devices"
  Then status = 200
    And the body:
    \"\"\"
{
    "foo": "bar"
}
    \"\"\"
  ------------------------------------------
  """

Scenario: Generate scenario with query parameters
Given the upstream path "GET" "/drivers" should respond:
  """
  {
    "name": "John"
  }
  """
When upstream starts on port 9999
Given a request
  And the query strings:
  | q | search |
When GET "/drivers"
  And upstream stops
Then status = 200
  And the body:
  """
{
  "name": "John"
}
  """
  And the file "tests-generated/local/GET_drivers.feature" not exists
  And the console print:
  """
  ------------------------------------------
  New Test Scenarion generated 🚀🚀🚀
  ------------------------------------------
  Given a request
    And the query strings:
      | q | search |
  When GET "/drivers"
  Then status = 200
    And the body:
    \"\"\"
{
    "name": "John"
}
    \"\"\"
  ------------------------------------------
  """

Scenario: Generate scenario with specific request body
Given the upstream path "POST" "/loan" should respond:
  """
  {
    "id": 1234,
    "name": "John"
  }
  """
When upstream starts on port 9999
Given a request
  And the payload:
  """
  {
    "name": "John"
  }
  """
When POST "/loan"
  And upstream stops
Then status = 200
  And the body:
  """
{
  "id": 1234,
  "name": "John"
}
  """
  And the file "tests-generated/local/POST_loan.feature" not exists
  And the console print:
  """
  ------------------------------------------
  New Test Scenarion generated 🚀🚀🚀
  ------------------------------------------
  Given a request
    And the payload:
    \"\"\"
  {
    "name": "John"
  }
    \"\"\"
  When POST "/loan"
  Then status = 200
    And the body:
    \"\"\"
  {
    "id": 1234,
    "name": "John"
  }
    \"\"\"
  ------------------------------------------
  """
