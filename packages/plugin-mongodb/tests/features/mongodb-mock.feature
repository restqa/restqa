Feature: Example to test the plugin

Scenario: Insert and search on one field
Given I insert in the collection "users":
  | firstname    | lastname | age | line.displayName | line.id |
  | John         | Doe      | 28  | johndoe          | 123456  |
  | johnny       | doe      | 26  | johnny5          | 45678   |
When I search in the collection "users":
  | firstname |
  | John |
Then the result of the search at "firstname" should equal "John"
Then the result of the search at "lastname" should equal "Doe"
Then the result of the search at "line.displayName" should equal "johndoe"
Then the result of the search at "line.id" should equal "123456"
Then the result of the search at "age" should equal 28
Then the db collection "users" exists

Scenario: Insert and search on nested field
Given I insert in the collection "users":
  | firstname    | lastname | age | line.displayName | line.id |
  | John         | Doe      | 32  | johndoe          | 123456  |
  | johnny       | doe      | 26  | johnny5          | 45678   |
When I search in the collection "users":
  | line.displayName | 
  | johndoe | 
Then the result of the search at "firstname" should equal "John"
Then the result of the search at "lastname" should equal "Doe"
Then the result of the search at "line.displayName" should equal "johndoe"
Then the result of the search at "line.id" should equal "123456"
Then the result of the search at "age" should equal 32
Then the db collection "users" exists

Scenario: Insert and search on multi fields
Given I insert in the collection "users":
  | firstname    | lastname | age | line.displayName | line.id |
  | John         | Doe      | 28  | johndoe          | 123456  |
  | johnny       | doe      | 26  | johnny5          | 45678   |
When I search in the collection "users":
  | age | lastname |
  |  26 | doe |
Then the result of the search at "firstname" should equal "johnny"
Then the result of the search at "lastname" should equal "doe"
Then the result of the search at "line.displayName" should equal "johnny5"
Then the result of the search at "line.id" should equal "45678"
Then the result of the search at "age" should equal 26
Then the db collection "users" exists
