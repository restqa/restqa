Feature: Generate a Test Scenario (file)

Scenario: Initial scenario
Given the upstream path "GET" "/account" should respond:
  """
  {
    "foo": "bar"
  }
  """
When upstream starts on port 9999
Given a request
  And the headers:
  | x-restqa-scenario | Getting the foo bar |
When GET "/account"
  And upstream stops
Then status = 200
  And the body:
  """
{
  "foo": "bar"
}
  """
  And the file "tests-generated/local/GET_account.feature" exists
  And the file "tests-generated/local/GET_account.feature" content matchs:
  """
  Feature: GET /account

  Scenario: Getting the foo bar
  Given a request
  When GET "/account"
  Then status = 200
    And the body:
    \"\"\"
{
    "foo": "bar"
}
    \"\"\"
  """
  And the console print:
  """
  ------------------------------------------
  🤗 Scenario "Getting the foo bar" added to the file "tests-generated/local/GET_account.feature"
  ------------------------------------------
  """

Scenario: Generate scenario with query parameters
Given the upstream path "GET" "/users" should respond:
  """
  {
    "name": "John"
  }
  """
When upstream starts on port 9999
Given a request
  And the headers:
  | x-restqa-scenario | Search the users |
  And the query strings:
  | q | search |
When GET "/users"
  And upstream stops
Then status = 200
  And the body:
  """
{
  "name": "John"
}
  """
  And the file "tests-generated/local/GET_users.feature" exists
  And the file "tests-generated/local/GET_users.feature" content matchs:
  """
  Feature: GET /users

  Scenario: Search the users
  Given a request
    And the query strings:
      | q | search |
  When GET "/users"
  Then status = 200
    And the body:
    \"\"\"
{
    "name": "John"
}
    \"\"\"
  """

@skip
Scenario: Generate scenario with specific request body
Given the upstream path "POST" "/users" should respond:
  """
  {
    "id": 1234,
    "name": "John"
  }
  """
When upstream starts on port 9999
Given a request
  And the headers:
  | x-restqa-scenario | create a user |
  And the payload:
  """
  {
    "name": "John"
  }
  """
When POST "/users"
  And upstream stops
Then status = 200
  And the body:
  """
{
  "id": 1234,
  "name": "John"
}
  """
  And the file "tests-generated/local/POST_users.feature" exists
  And the file "tests-generated/local/POST_users.feature" content matchs:
  """
  Feature: POST /users

  Scenario: create a user
  Given a request
    And the payload:
    \"\"\"
  {
    "name": "John"
  }
    \"\"\"
  When POST "/users"
  Then status = 200
    And the body:
    \"\"\"
  {
    "id": 1234,
    "name": "John"
  }
    \"\"\"
  """

Scenario: Adding scenario to existing file
Given the upstream path "GET" "/accounting" should respond:
  """
  {
    "foo": "bar"
  }
  """
When upstream starts on port 9999
Given a request
  And the headers:
  | x-restqa-scenario | Getting the foo bar |
When GET "/accounting"
Then status = 200
  And the body:
  """
{
  "foo": "bar"
}
  """
Given a request
  And the headers:
  | x-restqa-scenario | Getting the searching foo bar |
  And the query strings:
  | q | search |
When GET "/accounting"
  And upstream stops
Then status = 200
  And the body:
  """
{
  "foo": "bar"
}
  """
  And the file "tests-generated/local/GET_accounting.feature" exists
  And the file "tests-generated/local/GET_accounting.feature" content matchs:
  """
  Feature: GET /accounting

  Scenario: Getting the foo bar
  Given a request
  When GET "/accounting"
  Then status = 200
    And the body:
    \"\"\"
{
    "foo": "bar"
}
    \"\"\"

  Scenario: Getting the searching foo bar
  Given a request
    And the query strings:
      | q | search |
  When GET "/accounting"
  Then status = 200
    And the body:
    \"\"\"
{
    "foo": "bar"
}
    \"\"\"
  """

Scenario: Replacing scenario to existing file (1scenario)
Given the upstream path "GET" "/agent" should respond:
  """
  {
    "agent": "bar"
  }
  """
When upstream starts on port 9999
Given a request
  And the headers:
  | x-restqa-scenario | Getting the agent bar |
When GET "/agent"
Then status = 200
  And the body:
  """
{
  "agent": "bar"
}
  """
Given a request
  And the headers:
  | x-restqa-scenario | Getting the agent bar |
  And the query strings:
  | q | search |
When GET "/agent"
  And upstream stops
Then status = 200
  And the body:
  """
{
  "agent": "bar"
}
  """
  And the file "tests-generated/local/GET_agent.feature" exists
  And the file "tests-generated/local/GET_agent.feature" content matchs:
  """
  Feature: GET /agent

  Scenario: Getting the agent bar
  Given a request
    And the query strings:
      | q | search |
  When GET "/agent"
  Then status = 200
    And the body:
    \"\"\"
{
    "agent": "bar"
}
    \"\"\"
  """


Scenario: Replacing scenario to existing file ( multiple scenarios)
Given the upstream path "GET" "/advisor" should respond:
  """
  {
    "advisor": "bar"
  }
  """
When upstream starts on port 9999
Given a request
  And the headers:
  | x-restqa-scenario | Getting the advisor bar |
When GET "/advisor"
Then status = 200
  And the body:
  """
{
  "advisor": "bar"
}
  """
Given a request
  And the headers:
  | x-restqa-scenario | Getting the second advisor bar |
  And the query strings:
  | q | search |
When GET "/advisor"
Then status = 200
  And the body:
  """
{
  "advisor": "bar"
}
  """
Given a request
  And the headers:
  | x-restqa-scenario | Getting the advisor bar |
  And the query strings:
  | q | search1 |
When GET "/advisor"
  And upstream stops
Then status = 200
  And the body:
  """
{
  "advisor": "bar"
}
  """
  And the file "tests-generated/local/GET_advisor.feature" exists
  And the file "tests-generated/local/GET_advisor.feature" content matchs:
  """
  Feature: GET /advisor

  Scenario: Getting the advisor bar
  Given a request
    And the query strings:
      | q | search1 |
  When GET "/advisor"
  Then status = 200
    And the body:
    \"\"\"
{
    "advisor": "bar"
}
    \"\"\"

  Scenario: Getting the second advisor bar
  Given a request
    And the query strings:
      | q | search |
  When GET "/advisor"
  Then status = 200
    And the body:
    \"\"\"
{
    "advisor": "bar"
}
    \"\"\"
  """
