const when = require("./functions");

/**
 * All the steps related to the Api call
 *
 * @module When
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
   * ### When I run the API
   * Trigger the api call
   *
   * @category Send
   *
   * @example
   * When I run the API
   *
   * @function callApi
   */
  [
    "I run the API",
    when.callApi,
    "Trigger the api request",
    "api, call, generator"
  ]
];
