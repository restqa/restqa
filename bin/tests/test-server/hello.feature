Feature: Hello
  Scenario: Scenario all good
    Given I have the api gateway
      And I have the path "/hello"
      And I have the method "GET"
    When I run the API
    Then I should receive a response with the status 200
      And the response body at "value" should equal "world"