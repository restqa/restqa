const then = require("./functions");

/**
 * All the steps related to the API response
 *
 * @module Then
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
   * ### Then I should receive a response with the status {int}
   * Ensure the response was received with a given status.
   *
   *
   * @category Status code
   *
   * @example
   * Then I should receive a response with the status 200
   * Then I should receive a response with the status 404
   *
   * @function httpCode
   */
  [
    "I should receive a response with the status {int}",
    then.httpCode,
    "Check the response http code",
    "api, response, status, httpcode, generator"
  ],

  /**
   * ### Then the response time is under {int} ms
   * Ensure the response time is lower than the given time (in microseconds)
   *
   * @category Latency
   *
   * @example
   * Then the response time is under 100 ms
   *
   * @function httpLatency
   */
  [
    "the response time is under {int} ms",
    then.httpTiming,
    "Check the response latency",
    "api, response, time, timing, latency"
  ],

  /**
   * ### Then the header {string} should be {string}
   * Ensure a response header equals the expect value
   *
   * @category Headers
   *
   * @example
   * Then the header "Content-Type" should be "application/json"
   *
   * @function header
   */
  [
    "the header {string} should be {string}",
    then.headerValueEqual,
    "Check if a property in the response header has the exact string value",
    "api, response, table, headers, header"
  ],

  /**
   * ### Then the response header should contains:
   * Ensure a response header equals the list of values
   *
   * @category Headers
   *
   * @example
   * Then the response headers should contains:
   *   | Content-Type   | application/json |
   *   | Content-Length | 1458             |
   *
   * @example <caption>Using placeholders</caption>
   * Then the response headers should contains:
   *   | Content-Type   | {{ contentType}} |
   *   | Content-Length | 1458             |
   *
   *
   * @function headers
   */
  [
    "the response headers should contains:",
    then.headers,
    "Check multiple response headers (table format)",
    "api, response, table, headers, header"
  ],

  /**
   * ### Then {string} should be on the response header
   * Ensure a response header contains one specific property
   *
   * @category Headers
   *
   * @example
   * Then "Content-Length" should be on the response header
   * Then "X-response-time" should be on the response header
   *
   *
   * @function headersContains
   */
  [
    "{string} should be on the response header",
    then.headerValueExist,
    "Check if a property is in the response header",
    "api, response, table, headers, header"
  ],

  /**
   * ### Then {string} should not be on the response header
   * Ensure a response header doesn't contain one specific property
   *
   * @category Headers
   *
   * @example
   * Then "X-response-time" should not be on the response header
   * Then "poweered-by" should not be on the response header
   *
   *
   * @function headersNotContains
   */
  [
    "{string} should not be on the response header",
    then.headerValueNotExist,
    "Check if a property is in the response header",
    "api, response, table, headers, header"
  ],

  // Response body
  /**
   * ### Then the response should be empty array
   * Ensure a response body contains an empty array
   *
   * @category JSON Response body
   *
   * @example
   * Then the response should be empty array
   *
   * @function emptyArray
   */
  [
    "the response should be empty array",
    then.shouldBeEmptyArrayResponse,
    "Check a value in the body response that it is empty array",
    "api, response, body, array"
  ],

  /**
   * ### Then the response should not be empty array
   * Ensure a response body doesn't contain an empty array
   *
   * @category JSON Response body
   *
   * @example
   * Then the response should not be empty array
   *
   * @function notEmptyArray
   */
  [
    "the response should not be empty array",
    then.shouldNotBeEmptyArrayResponse,
    "Check if the response list is not empty",
    "api, response, body, jsonpath, dot-object, array"
  ],

  /**
   * ### Then the response should be empty
   * Ensure a response body is empty
   *
   * @category JSON Response body
   *
   * @example
   * Then the response should be empty
   *
   * @function emptyResponse
   */
  [
    "the response should be empty",
    then.shouldBeEmptyResponse,
    "Check if the response body is empty",
    "api, response, body"
  ],

  /**
   * ### Then the response body at {string} should equal {string | int | data }
   * Ensure a JSON response body equals a given value at the JSON path. Equality is determined
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then the response body at "id" should equal 10
   * Then the response body at "user.firstname" should equal "john"
   * Then the response body at "user.lastname" should equal {{ lastname }}
   *
   * @example <caption>Using json path</caption>
   * Then the response body at "$.id" should equal 10
   * Then the response body at "$.user.firstname" should equal "john"
   * Then the response body at "$.user.lastname" should equal {{ lastname }}
   *
   * @function bodyPropertyEqual
   */
  [
    "the response body at {string} should equal {data}",
    then.shouldBeString,
    "Check a value in the body response as a string (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, data"
  ],
  [
    "the response body at {string} should equal {string}",
    then.shouldBeString,
    "Check a value in the body response as a string (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, string"
  ],
  [
    "the response body at {string} should equal {float}",
    then.shouldBeNumber,
    "Check a value in the body response as a int (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, number"
  ],

  /**
   * ### Then the response body at {string} should not be equal to {string | int | data }
   * Ensure a JSON response body not equals a given value at the JSON path. Equality is not determined
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then the response body at "id" should not be equal to 10
   * Then the response body at "user.firstname" should not be equal to "john"
   * Then the response body at "user.lastname" should not be equal to {{ lastname }}
   *
   * @example <caption>Using json path</caption>
   * Then the response body at "$.id" should not be equal to 10
   * Then the response body at "$.user.firstname" should not be equal to "john"
   * Then the response body at "$.user.lastname" should not be equal to {{ lastname }}
   *
   * @function bodyPropertyNotEqual
   */
  [
    "the response body at {string} should not be equal to {data}",
    then.shouldNotBeEqual,
    "Invalidate a value in the body response as a string (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, data"
  ],
  [
    "the response body at {string} should not be equal to {string}",
    then.shouldNotBeEqual,
    "Invalidate a value in the body response as a string (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, string"
  ],
  [
    "the response body at {string} should not be equal to {float}",
    then.shouldNotBeEqual,
    "Invalidate a value in the body response as a int (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, number"
  ],

  /**
   * ### Then the response body at {string} should be equal to:
   * Verify a specific property from the response body against a JSON object or a multiline text
   *
   * @category JSON Response body
   *
   * @example
   * Then the response body at "$.person" should equal:
   * """
   *   {
   *     "firstName": "John",
   *     "lastName": "Doe"
   *   }
   * """
   *
   * @example
   * Then the response body at "$.person" should equal:
   * """
   * John
   * Doe
   * """
   *
   * @function bodyPropertyMultiline
   */
  [
    "the response body at {string} should equal:",
    then.shouldBePropertyMultiline,
    "Check a value in the body response as a json (dot-object or jsonpath pattern)",
    "api, response, body, jsonpath, dot-object, json"
  ],

  /**
   * ### Then the response body at {string} should equal true
   * Ensure a JSON response body equals a given boolean value as true
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then the response body at "active" should equal true
   *
   * @example <caption>Using json path</caption>
   * Then the response body at "$.active" should equal true
   *
   * @function bodyPropertyEqualTrue
   */
  [
    "the response body at {string} should equal true",
    then.shouldBeTrue,
    "Check if a value is true in the body response (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, true, boolean"
  ],

  /**
   * ### Then the response body at {string} should equal false
   * Ensure a JSON response body equals a given boolean value as false
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then the response body at "active" should equal false
   *
   * @example <caption>Using json path</caption>
   * Then the response body at "$.active" should equal false
   *
   * @function bodyPropertyEqualFalse
   */
  [
    "the response body at {string} should equal false",
    then.shouldBeFalse,
    "Check if a value is false in the body response (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, false, boolean"
  ],

  /**
   * ### Then the response body at {string} should equal null
   * Ensure a JSON response body equals a given null value
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then the response body at "active" should equal null
   *
   * @example <caption>Using json path</caption>
   * Then the response body at "$.active" should equal null
   *
   * @function bodyPropertyEqualNull
   */
  [
    "the response body at {string} should equal null",
    then.shouldBeNull,
    "Check if a value is null in the body response (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, null"
  ],

  /**
   * ### Then the response body at {string} should equal empty
   * Ensure a JSON response body equals an empty string
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then the response body at "active" should equal empty
   *
   * @example <caption>Using json path</caption>
   * Then the response body at "$.active" should equal empty
   *
   * @function bodyPropertyEqualEmpty
   */
  [
    "the response body at {string} should equal empty",
    then.shouldBeEmpty,
    "Check if a value is empty in the body response (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, empty"
  ],

  /**
   * ### Then the response body at {string} should be an array
   * Ensure a JSON response body equals an array type
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then the response body at "user.list" should be an array
   *
   * @example <caption>Using json path</caption>
   * Then the response body at "$.user.list" should be an array
   *
   * @function bodyPropertyIsArray
   */
  [
    "the response body at {string} should be an array",
    then.shouldBeAnArray,
    "Check if a value is an array in the body response (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, array"
  ],

  /**
   * ### Then the response body at {string} should be an array of {int} items
   * Ensure a JSON response body equals an array containing a given items
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then the response body at "user.list" should be an array of 10 items
   *
   * @example <caption>Using json path</caption>
   * Then the response body at "$.user.list" should be an array of 10 items
   *
   * @function bodyPropertyIsArrayOfLenght
   */
  [
    "the response body at {string} should be an array of {int} items",
    then.shouldBeAnArrayOfXItems,
    "Check if a value is an array of a few items in the body response (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, array, array-items"
  ],

  /**
   * ### Then the response body at {string} should be close to now
   * Ensure a JSON response body has a time set close to now ( -/+ 1 minute)
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then the response body at "user.createdAt" should equal close to now
   *
   * @example <caption>Using json path</caption>
   * Then the response body at "$.user.list" should equal close to now
   *
   * @function bodyPropertyIsATimeCloseToNow
   */
  [
    "the response body at {string} should equal close to now",
    then.shouldBeNow,
    "Check if a date is close to now (ex: to check if a createdAt date is valid)",
    "api, response, body, jsonpath, dot-object, now"
  ],

  /**
   * ### Then the response body at {string} should not be null
   * Ensure a JSON response body is not null
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then the response body at "user.children" should not be null
   *
   * @example <caption>Using json path</caption>
   * Then the response body at "$.user.childern" should not be null
   *
   * @function bodyPropertyIsNotNull
   */
  [
    "the response body at {string} should not be null",
    then.shouldNotBeNull,
    "Check if a value is not null in the body response (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, null"
  ],

  /**
   * ### Then the response body at {string} should match {string}
   * Ensure a JSON response body matches a given regexp
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then the response body at "user.occupation" should match "/pilot/"
   *
   * @example <caption>Using json path</caption>
   * Then the response body at "$.user.occupation" should match "/pilot/"
   *
   * @function bodyPropertyShouldMatchRegexp
   */
  [
    "the response body at {string} should match {string}",
    then.shouldMatch,
    "Check if a value match a specific regex",
    "api, response, body, jsonpath, dot-object, regexp, regex"
  ],

  /**
   * ### Then the response list should contains {int} items
   * Ensure a JSON response body has an array at the root level an contains a given number of items
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then the response list should contain 12 items
   *
   * @function bodyListContainNumberOfItem
   */
  [
    "the response list should contain {int} items",
    then.shouldBeArraySize,
    "Check if the response list is of a certain size",
    "api, response, body, jsonpath, dot-object, array-body"
  ],

  /**
   * ### Then the response body should be equal to:
   * Verify the response body against a JSON object
   *
   * @category JSON Response body
   *
   * @example
   * Then the response body should be equal to:
   * """
   *   {
   *     "firstName": "John"
   *   }
   * """
   *
   * @function bodyJson
   */
  [
    "the response body should be equal to:",
    then.shouldBeJsonBody,
    "Check if the response body is equal to the passed json body",
    "api, response, body, jsonpath, dot-object, jsonbody, generator"
  ],

  /**
   * ### Then the response body at {string} should be greater than {int}
   * Verify if a specific value from the response body is greater than the expected value
   *
   * @category Sort Numeric
   *
   * @example
   * Then the response body at "$.person.age" should be greater than 10
   *
   * @example <caption>Placeholder from datasets</caption>
   * Then the response body at "$.person.age" should be greater than {{ age }}
   *
   * @function greaterThan
   */
  [
    "the response body at {string} should be greater than {float}",
    then.shouldBeGreaterThan,
    "Check if a value in the response body is greater than an expected value",
    "api, response, body, jsonpath, dot-object, number, numeric"
  ],
  [
    "the response body at {string} should be greater than {data}",
    then.shouldBeGreaterThan,
    "Check if a value in the response body is greater than an expected value (placeholder)",
    "api, response, body, jsonpath, dot-object, number, numeric"
  ],

  /**
   * ### Then the response body at {string} should be less than {int}
   * Verify if a specific value from the response body is less than an expected value
   *
   * @category Sort Numeric
   *
   * @example
   * Then the response body at "$.person.age" should be less than 10
   *
   * @example <caption>Placeholder from datasets</caption>
   * Then the response body at "$.person.age" should be less than {{ age }}
   *
   * @function lessThan
   */
  [
    "the response body at {string} should be less than {float}",
    then.shouldBeLessThan,
    "Check if a value in the response body is less than an expected value",
    "api, response, body, jsonpath, dot-object, number, numeric"
  ],
  [
    "the response body at {string} should be less than {data}",
    then.shouldBeLessThan,
    "Check if a value in the response body is less than an expected value (placeholder)",
    "api, response, body, jsonpath, dot-object, number, numeric"
  ],

  /**
   * ### Then the response body at {string} should be greater than or equal to {int}
   * Verify if a specific value from the response body is greater than or equal to an expected value
   *
   * @category Sort Numeric
   *
   * @example
   * Then the response body at "$.person.age" should be greater than or equal to 10
   *
   * @example <caption>Placeholder from datasets</caption>
   * Then the response body at "$.person.age" should be greater than or equal to {{ age }}
   *
   * @function greaterThanOrEqualTo
   */
  [
    "the response body at {string} should be greater than or equal to {float}",
    then.shouldBeGreaterThanOrEqualTo,
    "Check if a value in the response body is greater than or equal to an expected value",
    "api, response, body, jsonpath, dot-object, number, numeric"
  ],
  [
    "the response body at {string} should be greater than or equal to {data}",
    then.shouldBeGreaterThanOrEqualTo,
    "Check if a value in the response body is greater than or equal to an expected value (placeholder)",
    "api, response, body, jsonpath, dot-object, number, numeric"
  ],

  /**
   * ### Then the response body at {string} should be less than or equal to {int}
   * Verify if a specific value from the response body is less than or equal to an expected value
   *
   * @category Sort Numeric
   *
   * @example
   * Then the response body at "$.person.age" should be less than or equal to 10
   *
   * @example <caption>Placeholder from datasets</caption>
   * Then the response body at "$.person.age" should be less than or equal to {{ age }}
   *
   * @function lessThanOrEqualTo
   */
  [
    "the response body at {string} should be less than or equal to {float}",
    then.shouldBeLessThanOrEqualTo,
    "Check if a value in the response body is less than or equal to an expected value",
    "api, response, body, jsonpath, dot-object, number, numeric"
  ],
  [
    "the response body at {string} should be less than or equal to {data}",
    then.shouldBeLessThanOrEqualTo,
    "Check if a value in the response body is less than or equal to an expected value (placeholder)",
    "api, response, body, jsonpath, dot-object, number, numeric"
  ],

  /**
   * ### Then the response body at {string} should be a date before {string}
   * Verify and compare if a specific date from the response body comes before the expected date
   * The expected date should follow the pattern 'YYYY/MM/DD' (reference: RFC2822)
   *
   * @category Date
   *
   * @example
   * Then the response body at "$.createdAt" should be a date before "2020/12/01"
   * Then the response body at "$.createdAt" should be a date before "2020/12/01 23:30:00"
   *
   * @example <caption>Placeholder from datasets</caption>
   * Then the response body at "$.createdAt" should be a date before {{ my-date }}
   *
   * @function DateBefore
   */
  [
    "the response body at {string} should be a date before {string}",
    then.shouldBeDateBefore,
    "Check if a date from the response body is before the expected date",
    "api, response, body, jsonpath, dot-object, date"
  ],
  [
    "the response body at {string} should be a date before {data}",
    then.shouldBeDateBefore,
    "Check if a date from the response body is before the expected date (placeholder)",
    "api, response, body, jsonpath, dot-object, date"
  ],

  /**
   * ### Then the response body at {string} should be a date before today
   * Verify and compare if a specific date from the response body is comes before the current day
   *
   * @category Date
   *
   * @example
   * Then the response body at "$.createdAt" should be a date before today
   *
   * @function DateBeforeToday
   */
  [
    "the response body at {string} should be a date before today",
    then.shouldBeDateBeforeToday,
    "Check if a date from the response body is before the current day",
    "api, response, body, jsonpath, dot-object, date, today"
  ],

  /**
   * ### Then the response body at {string} should be a date after {string}
   * Verify and compare if a specific date from the response body comes after an expected date
   * The expected date should follow the pattern 'YYYY/MM/DD' (reference: RFC2822)
   *
   * @category Date
   *
   * @example
   * Then the response body at "$.createdAt" should be a date after "2020/12/01"
   * Then the response body at "$.createdAt" should be a date after "2020/12/01 23:30:00"
   *
   * @example <caption>Placeholder from datasets</caption>
   * Then the response body at "$.createdAt" should be a date after {{ my-date }}
   *
   * @function DateAfter
   */
  [
    "the response body at {string} should be a date after {string}",
    then.shouldBeDateAfter,
    "Check if a date from the response body is after an expected date",
    "api, response, body, jsonpath, dot-object, date"
  ],
  [
    "the response body at {string} should be a date after {data}",
    then.shouldBeDateAfter,
    "Check if a date from the response body is after an expected date (placeholder)",
    "api, response, body, jsonpath, dot-object, date"
  ],

  /**
   * ### Then the response body at {string} should be a date after today
   * Verify and compare if a specific date from the response body comes after the current day
   *
   * @category Date
   *
   * @example
   * Then the response body at "$.createdAt" should be a date after today
   *
   * @function DateAfterToday
   */
  [
    "the response body at {string} should be a date after today",
    then.shouldBeDateAfterToday,
    "Check if a date from the response body is after the current day",
    "api, response, body, jsonpath, dot-object, date, today"
  ],

  /*
   * ### Then the response body should match the json schema from {string}
   * Validate the format of the response body using the [JSON Schema](https://json-schema.org/) definition.
   * The JSON need to be defined on a .json file.
   * In order to use this feature you need to specify the location of you test data storage.
   * The validation is based on the [Ajv](https://ajv.js.org/), feel free to look at the options.
   *
   * @category Validation
   *
   * @example
   * Then the response body should match the json schema from "person.json"
   *
   * @example <caption>Placeholder from datasets</caption>
   * Then the response body should match the json schema from {{ file }}
   *
   * @function jsonschema
   */
  [
    "the response body should match the json schema from {string}",
    then.shouldMatchJsonSchema,
    "Check if a value in the response body is less than or equal to an expected value",
    "api, response, body, jsonpath, dot-object, schema, json-schema, jsonschema"
  ],
  [
    "the response body should match the json schema from {data}",
    then.shouldMatchJsonSchema,
    "Check if a value in the response body is less than or equal to an expected value (placeholder)",
    "api, response, body, jsonpath, dot-object, schema, json-schema, jsonschema"
  ],

  /**
   * ### Then the response body at {string} should match the json schema from {string}
   * Validate the format of a specific value from the response body using the [JSON Schema](https://json-schema.org/) definition.
   * The JSON need to be defined on a .json file.
   * In order to use this feature you need to specify the location of you test data storage.
   * The validation is based on the [Ajv](https://ajv.js.org/), feel free to look at the options.
   *
   * @category Validation
   *
   * @example
   * Then the response body at "$.person" should match the json schema from "person.json"
   *
   * @example <caption>Placeholder from datasets</caption>
   * Then the response body at "$.person" should match the json schema from {{ file }}
   *
   * @function jsonschema
   */
  [
    "the response body at {string} should match the json schema from {string}",
    then.shouldMatchPropertyJsonSchema,
    "Check if a value in the response body is a JSON schema definition",
    "api, response, body, jsonpath, dot-object, schema, json-schema, jsonschema"
  ],
  [
    "the response body at {string} should match the json schema from {data}",
    then.shouldMatchPropertyJsonSchema,
    "Check if a value in the response body is a JSON schema definition (placeholder)",
    "api, response, body, jsonpath, dot-object, schema, json-schema, jsonschema"
  ],

  // Response Dataset

  /**
   * ### Then add the value {string} from the response header to the dataset as {string}
   * Pick of the reponse header value and add it into the dataset storage
   * This will allow you to reuse value in another step
   *
   * @category Dataset
   *
   * @example
   * Then add the value "Content-Type" from the response header to the dataset as "contentType"
   * Given I have the api gateway
   *   And the header contains "Content-Type" as {{ contentType }}
   *
   *
   * @function saveHeaderPropertyIntoTheDataset
   */
  [
    "add the value {string} from the response header to the dataset as {string}",
    then.addHeaderPropertyToDataset,
    "Take on of the value from the response header and add it to the dataset",
    "api, response, header, jsonpath, dot-object, dataset"
  ],

  /**
   * ### Then add the value {string} from the response body to the dataset as {string}
   * Pick of the reponse body value and add it into the dataset storage
   * This will allow you to reuse value in another step
   *
   * @category Dataset
   *
   * @example <caption>Using dot object</caption>
   * Then add the value "user.id" from the response body to the dataset as "userId"
   * Given I have the api gateway
   *   And I have the path "/users/{userId}"
   *
   * @example <caption>Using json path</caption>
   * Then add the value "$.user.id" from the response body to the dataset as "userId"
   * Given I have the api gateway
   *   And I have the path "/users/{{userId}}"
   *
   * @function saveBodyPropertyIntoTheDataset
   */
  [
    "add the value {string} from the response body to the dataset as {string}",
    then.addBodyPropertyToDataset,
    "Take on of the value from the response body and add it to the dataset",
    "api, response, body, jsonpath, dot-object, dataset"
  ],

  /**
   * ### Then I add the cookie to the jar
   * Add the cookie into the Jar ^^
   *
   * @category Cookie
   *
   * By adding the cookie into the jar the following request will contains the cookie into the header
   *
   * @example
   * Then I add the cookie to the jar
   *
   * @function cookiejar
   */
  [
    "I add the cookie to the jar",
    then.cookieJar,
    "Add the cookie from the response the a storage to get reused on the next call",
    "api, cooke, jar"
  ],

  /**
   * ### Then I print the request
   * Print the Request information (url, headers, body, method) into the console
   * This will allow you to debug your scenario.
   *
   * @category Debug
   *
   * @example
   * Then I print the request
   *
   * @function printRequest
   */
  [
    "I print the request",
    then.printRequest,
    "Print the request information into the console",
    "api, request, console, debug"
  ],

  /**
   * ### Then I print the response
   * Print the Response information (headers, response time,  body) into the console
   * This will allow you to debug your scenario.
   *
   * @category Debug
   *
   * @example
   * Then I print the response
   *
   * @function printResponse
   */
  [
    "I print the response",
    then.printResponse,
    "Print the response information into the console",
    "api, response, console, debug"
  ],

  /**
   * ### Then I print the value {string}
   * Print the a specific information value into the console
   * This will allow you to debug your scenario.
   *
   * @category Debug
   *
   * @example
   * Then I print the value "{{ userId }}"
   *
   * @function printValue
   */
  [
    "I print the value {string}",
    then.printValue,
    "Print a specific value into the console",
    "api, console, debug"
  ]
];
