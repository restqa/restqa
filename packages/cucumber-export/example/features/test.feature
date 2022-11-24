@skip
Feature: As a user i can manage my account

Scenario: Access to my account from the dashboad page
Given I have the dashboard page
When I click on my account
Then The title of the page should be "My account"
  And this is whut ?

Scenario: Access to my account from the menu
Given I have the dashboard page
When I click on my account
Then The title of the page should be "My account"
