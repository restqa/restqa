Feature: GET /

Scenario: Request Host (re-initiate a request)
Given a request
When GET "/"
Then status = 200
  And the body:
  """
{
  "hello": "world"
}
  """
Given a request
When GET "/hello"
Then status = 200
  And the body:
  """
{
  "message": "world"
}
  """

Scenario: Request an external Host
Given a request hosted on "https://jsonplaceholder.typicode.com"
When GET "/posts/1"
Then status = 200
  And the body:
  """
{
 "userId": 1,
 "id": 1,
 "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
 "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
}
  """

Scenario: Request and ignore ssl
Given a request
When GET "/"
Then status = 200
  And the body:
  """
{
  "hello": "world"
}
  """
