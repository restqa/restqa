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
   * ### Perform a POST api request on a specific path
   * Trigger the api call on a  path using a POST method
   *
   * @category Send
   *
   * @example <caption>string</caption>
   * When POST "/users"
   *
   * @example <caption>Placeholder using [datasets](#/documentation/dataset)</caption>
   * When POST "/users/{{userId}}"
   *
   * @function callApi
   */
  [
    "POST {string}",
    when.callApi("POST"),
    "Trigger the api request using the POST method",
    "api, call, generator"
  ],
  [
    "post {string}",
    when.callApi("POST"),
    "Trigger the api request using the POST method",
    "api, call"
  ],

  /**
   * ### Perform a GET api request on a specific path
   * Trigger the api call on a  path using a GET Method
   *
   * @category Send
   *
   * @example <caption>string</caption>
   * When GET "/users"
   *
   * @example <caption>Placeholder using [datasets](#/documentation/dataset)</caption>
   * When GET "/users/{{userId}}"
   *
   * @function callApi
   */
  [
    "GET {string}",
    when.callApi("GET"),
    "Trigger the api request using the GET method",
    "api, call, generator"
  ],
  [
    "get {string}",
    when.callApi("GET"),
    "Trigger the api request using the GET method",
    "api, call"
  ],

  /**
   * ### Perform a PATCH api request on a specific path
   * Trigger the api call on a  path using a PATCH Method
   *
   * @category Send
   *
   * @example <caption>string</caption>
   * When PATCH "/users"
   *
   * @example <caption>Placeholder using [datasets](#/documentation/dataset)</caption>
   * When PATCH "/users/{{userId}}"
   *
   * @function callApi
   */
  [
    "PATCH {string}",
    when.callApi("PATCH"),
    "Trigger the api request using the PATCH method",
    "api, call, generator"
  ],
  [
    "patch {string}",
    when.callApi("PATCH"),
    "Trigger the api request using the PATCH method",
    "api, call"
  ],

  /**
   * ### Perform a PUT api request on a specific path
   * Trigger the api call on a  path using a PUT Method
   *
   * @category Send
   *
   * @example <caption>string</caption>
   * When PUT "/users"
   *
   * @example <caption>Placeholder using [datasets](#/documentation/dataset)</caption>
   * When PUT "/users/{{userId}}"
   *
   * @function callApi
   */
  [
    "PUT {string}",
    when.callApi("PUT"),
    "Trigger the api request using the PUT method",
    "api, call, generator"
  ],
  [
    "put {string}",
    when.callApi("PUT"),
    "Trigger the api request using the PUT method",
    "api, call"
  ],

  /**
   * ### Perform a DELETE api request on a specific path
   * Trigger the api call on a  path using a DELETE Method
   *
   * @category Send
   *
   * @example <caption>string</caption>
   * When DELETE "/users"
   *
   * @example <caption>Placeholder using [datasets](#/documentation/dataset)</caption>
   * When DELETE "/users/{{userId}}"
   *
   * @function callApi
   */
  [
    "DELETE {string}",
    when.callApi("DELETE"),
    "Trigger the api request using the DELETE method",
    "api, call, generator"
  ],
  [
    "delete {string}",
    when.callApi("DELETE"),
    "Trigger the api request using the DELETE method",
    "api, call"
  ],

  /**
   * ### Perform a OPTIONS api request on a specific path
   * Trigger the api call on a  path using a OPTIONS Method
   *
   * @category Send
   *
   * @example <caption>string</caption>
   * When OPTIONS "/users"
   *
   * @example <caption>Placeholder using [datasets](#/documentation/dataset)</caption>
   * When OPTIONS "/users/{{userId}}"
   *
   * @function callApi
   */
  [
    "OPTIONS {string}",
    when.callApi("OPTIONS"),
    "Trigger the api request using the OPTIONS method",
    "api, call, generator"
  ],
  [
    "options {string}",
    when.callApi("OPTIONS"),
    "Trigger the api request using the OPTIONS method",
    "api, call"
  ],

  /**
   * ### Perform a HEAD api request on a specific path
   * Trigger the api call on a  path using a HEAD Method
   *
   * @category Send
   *
   * @example <caption>string</caption>
   * When HEAD "/users"
   *
   * @example <caption>Placeholder using [datasets](#/documentation/dataset)</caption>
   * When HEAD "/users/{{userId}}"
   *
   * @function callApi
   */
  [
    "HEAD {string}",
    when.callApi("HEAD"),
    "Trigger the api request using the HEAD method",
    "api, call, generator"
  ],
  [
    "head {string}",
    when.callApi("HEAD"),
    "Trigger the api request using the HEAD method",
    "api, call"
  ]
];
