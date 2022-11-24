Feature: Simple maths
  @beforeHookWithStringTag
  @beforeHookWithObjectTag
  @afterHookWithStringTag
  @afterHookWithObjectTag
  Scenario: Test plugin factory
    Given Log this "super-string"
    When I put my hands up
    Then Print state
