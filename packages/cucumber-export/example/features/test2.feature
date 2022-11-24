Feature: As a user i can manage my orders

Scenario: Access to my orders from the dashboad page
Given I have the dashboard page
When I click on my account
Then The title of the page should be "My account"

Scenario: Access to my orders from the menu
Given I have the dashboard page
When I click on my account

@success
Scenario: Access to my orders from the menu
Given I have the dashboard page
