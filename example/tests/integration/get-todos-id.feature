Feature: GET /todos/{id}

Scenario: Get todos by id
Given I have the api gateway
  And I have the path "/todos/45"
  And I have the method "GET"
When I run the API
Then I should receive a response with the status 200
  And the response body at "userId" should equal 3
  And the response body at "id" should equal 45
  And the response body at "title" should equal "velit soluta adipisci molestias reiciendis harum"
  And the response body at "completed" should equal false

Scenario: Get todos by id but id doesn't exist
Given I have the api gateway
  And I have the path "/todos/300000"
  And I have the method "GET"
When I run the API
Then I should receive a response with the status 404
