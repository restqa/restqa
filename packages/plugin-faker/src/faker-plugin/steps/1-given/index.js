const given = require("./handlers");

/**
 * All the steps related to the Fake data generation
 *
 * @module Given
 */

module.exports = [
  /**
   *  Format:
   *  ['Step definition', function handler, 'description','Tags']
   *
   *  Example:
   *  ['I do {int} + {int}', add, 'Calculate an addition', 'add, calculator, additional']
   *
   */

  /**
   * ### Given I use the {string} language to generate fake data
   * Define the locale to use during the fake data generation.
   * List of language available [here](https://github.com/Marak/Faker.js#Localization)
   *
   * @category Language
   *
   * @example
   * Given I use the "fr" language to generate fake data
   * Given I use the "nl_BE" language to generate fake data
   * Given fake locale = "cz"
   *
   * @example <caption>Placeholder from datasets</caption>
   * Given I use the {{ myLocale }} language to generate fake data
   * Given fake locale = {{ myLocale }}
   *
   *
   * @function locale
   */
  [
    "I use the {string} language to generate fake data",
    given.locale,
    "Define the local to user for the fake data",
    "faker, locale"
  ],
  [
    "I use the {data} language to generate fake data",
    given.locale,
    "Define the local to user for the fake data",
    "faker, locale, data"
  ],
  [
    "fake locale = {string}",
    given.locale,
    "Define the local to user for the fake data",
    "faker, locale, minimalist, data"
  ],

  /**
   * ### Given I generate a fake data for {string} and store it into the dataset as {string}
   * Generate a fake data and store it into the dataset in order to use it into an other step definition
   *
   * @category Generate
   *
   * @example
   * Given I generate a fake data for "name.firstName" and store it into the dataset as "firstName"
   * Given fake.data "name.lastName" => "name.lastName"
   * Then the response body at "user.lastname" should not be equal to {{ lastName }}
   *
   *
   * @function defineVariable
   */
  [
    "I generate a fake data for {string} and store it into the dataset as {string}",
    given.defineVariable,
    "Store a fake data into the dataset",
    "faker, dataset, variable"
  ],
  [
    "fake data {string} => {string}",
    given.defineVariable,
    "Store a fake data into the dataset",
    "faker, dataset, variable"
  ]
];
