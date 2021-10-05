Feature: Hello
  Scenario: Scenario all good
    Given I have the api gateway
    And I have the path "/hello"
    When I run the API
    Then I should receive a response with the status 200
    Then the response body should be equal to:
"""
world
"""