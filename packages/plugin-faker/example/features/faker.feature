Feature: Example feature

Scenario: Generate Fake data (defaul language)
Given I generate a fake data for "music.genre" and store it into the dataset as "music-genre"

Scenario: Generate Fake data (language: fr)
Given I use the "fr" language to generate fake data
Given fake data "music.genre" => "music-genre"

Scenario: Generate Fake data (language: it)
Given I use the "it" language to generate fake data
Given I generate a fake data for "name.firstName" and store it into the dataset as "firstName"

Scenario: Generate Fake data (language: es)
Given fake locale = "es"
Given fake data "name.lastName" => "lastName"
