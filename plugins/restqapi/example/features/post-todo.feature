Feature: POST /todos

Scenario: Create A new TODO
Given I have the api gateway
  And I have the path "/todos"
  And I have the method "POST"
  And the payload contains "userId" as "1"
  And the payload contains "title" as "A new RestQA post"
  And the payload contains "completed" as true
When I run the API
Then I should receive a response with the status 201
  And the response body at "userId" should equal "1"
  And the response body at "id" should equal 201
  And the response body at "title" should equal "A new RestQA post"
  And the response body at "completed" should equal true

Scenario: Create A new TODO but the userId doesn't exists
Given I have the api gateway
  And I have the path "/todos"
  And I have the method "POST"
  And the payload contains "userId" as "10101010"
  And the payload contains "title" as "A new RestQA post"
  And the payload contains "completed" as true
When I run the API
Then I should receive a response with the status 201
  And the response body at "userId" should equal "10101010"
  And the response body at "id" should equal 201
  And the response body at "title" should equal "A new RestQA post"
  And the response body at "completed" should equal true
