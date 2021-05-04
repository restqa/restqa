Feature: PUT /todos/{id}

Scenario: Update of a Todo
Given I have the api gateway
  And I have the path "/todos/1"
  And I have the method "PUT"
  And the payload contains "userId" as "1"
  And the payload contains "title" as "A new RestQA post"
  And the payload contains "completed" as true
When I run the API
Then I should receive a response with the status 200
  And the response body at "userId" should equal "1"
  And the response body at "id" should equal 1
  And the response body at "title" should equal "A new RestQA post"
  And the response body at "completed" should equal true

@skip
Scenario: Update of a Todo when the todo doesn't exist
Given I have the api gateway
  And I have the path "/todos/1919191"
  And I have the method "PUT"
  And the payload contains "userId" as "1"
  And the payload contains "title" as "A new RestQA post"
  And the payload contains "completed" as true
When I run the API
Then I should receive a response with the status 500
