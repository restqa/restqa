Feature: GET /todos

Scenario: Get the list of Todos
Given I have the api gateway
  And I have the path "/todos"
  And I have the method "GET"
When I run the API
Then I should receive a response with the status 200
  And the response should not be empty array
  And the response list should contain 200 items
  And the response body at "0.userId" should equal 1
  And the response body at "0.id" should equal 1
  And the response body at "0.title" should equal "delectus aut autem"
  And the response body at "0.completed" should equal false

Scenario: Filter the list by userId
Given I have the api gateway
  And I have the path "/todos"
  And I have the method "GET"
  And the query parameter contains "userId" as "3"
When I run the API
Then I should receive a response with the status 200
  And the response should not be empty array
  And the response list should contain 20 items
  And the response body at "0.userId" should equal 3
  And the response body at "0.id" should equal 41
  And the response body at "0.title" should equal "aliquid amet impedit consequatur aspernatur placeat eaque fugiat suscipit"
  And the response body at "0.completed" should equal false

Scenario: Filter the list by userId with an invalid userId
Given I have the api gateway
  And I have the path "/todos"
  And I have the method "GET"
  And the query parameter contains "userId" as "3000"
When I run the API
Then I should receive a response with the status 200
  And the response should be empty array
