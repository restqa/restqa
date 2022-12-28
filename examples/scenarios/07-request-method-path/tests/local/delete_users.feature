Feature: DELETE /users

Scenario: delete a specific user
Given a request
When DELETE "/users"
Then status = 204
