Feature: Hello
  Scenario: Scenario using mock
    Given a request
    When GET "/status"
    Then status = 200
      And "message" = "I'm a mock"
