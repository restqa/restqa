Feature: PATCH /todos/{id}

Scenario: Partial update of the Todo
Given I have the api gateway
  And I have the path "/todos/1"
  And I have the method "PATCH"
  And the payload contains "title" as "A new RestQA post"
When I run the API
Then I should receive a response with the status 200
  And the response body at "userId" should equal 1
  And the response body at "id" should equal 1
  And the response body at "title" should equal "A new RestQA post"
  And the response body at "completed" should equal false

Scenario: Partial update of a todo that doesn't exist
Given I have the api gateway
  And I have the path "/todos/1000200"
  And I have the method "PATCH"
  And the payload contains "title" as "A new RestQA post"
When I run the API
Then I should receive a response with the status 200
  And the response body at "title" should equal "A new RestQA post"
