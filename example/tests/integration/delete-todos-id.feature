@performance
Feature: DELETE /todos/{id}

Scenario: Delete todos by id
Given I have the api gateway
  And I have the path "/todos/45"
  And I have the method "DELETE"
When I run the API
Then I should receive a response with the status 200

Scenario: Get todos by id but id doesn't exist
Given I have the api gateway
  And I have the path "/todos/300000"
  And I have the method "DELETE"
When I run the API
Then I should receive a response with the status 200
