Feature: GET /post/:id/comments

Scenario: Valid Scenario
Given a request
When GET "/post/1/comments"
Then status = 200
  And body = [] (not empty)
  And "[0].body" equals:
  """
  laudantium enim quasi est quidem magnam voluptate ipsam eos
  tempora quo necessitatibus
  dolor quam autem quasi
  reiciendis et nam sapiente accusantium
  """
Scenario: Valid Scenario without "Given" keyword
When GET "/post/1/comments"
Then status = 200
  And body = [] (not empty)
  And "[0].body" equals:
  """
  laudantium enim quasi est quidem magnam voluptate ipsam eos
  tempora quo necessitatibus
  dolor quam autem quasi
  reiciendis et nam sapiente accusantium
  """
