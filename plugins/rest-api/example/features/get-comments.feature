Feature: GET /post/:id/comments

Scenario: Valid Scenario
Given I have the api gateway
  And I have the path "/post/1/comments"
  And I have the method "GET"
When I run the API
Then I should receive a response with the status 200
  And the response should not be empty array
  And the response body at "[0].body" should equal:
  """
  laudantium enim quasi est quidem magnam voluptate ipsam eos
  tempora quo necessitatibus
  dolor quam autem quasi
  reiciendis et nam sapiente accusantium
  """
