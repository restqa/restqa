Feature: Example feature

Scenario: Generate Fake data (defaul language)
Given a request
  And the query strings:
  | music | {{ faker.music.genre }} |
When GET "/info"
Then status = 200
  And add "$.music" from the body to the dataset as "music"
  And Check "{{ music }}" is an actual value from faker
