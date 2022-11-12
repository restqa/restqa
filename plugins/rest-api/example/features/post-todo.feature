Feature: POST /todos

Scenario: Create A new TODO
Given a request
  And the payload:
  """
  {
    "userId": "1",
    "title": "A new RestQA post",
    "completed": true
  }
  """
When POST "/todos"
Then status = 201
  And "userId" = "1"
  And "id" = 201
  And "title" = "A new RestQA post"
  And "completed" is true

Scenario: Create A new TODO but the userId doesn't exists
Given the payload:
  """
  {
    "userId": "10101010",
    "title": "A new RestQA post",
    "completed": true
  }
  """
When POST "/todos"
Then status = 201
  And "userId" = "10101010"
  And "id" = 201
  And "title" = "A new RestQA post"
  And "completed" is true
  And "userId"<number> > 10
