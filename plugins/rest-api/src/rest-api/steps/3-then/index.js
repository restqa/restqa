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

   //* **************************************************************************************
   //* **************************************************************************************
   // STATUS
   //* **************************************************************************************
   //* **************************************************************************************

  /**
   * ### Assert the HTTP status code value
   * Ensure the response was received with a given status.
   *
   *
   * @category Status code
   *
   * @example
   * Then status = 200
   * Then status = 404
   *
   * @function httpCode
   */
  [
    "status = {int}",
    then.httpCode,
    "Check the response http code",
    "api, response, status, httpcode, generator"
  ],

   //* **************************************************************************************
   //* **************************************************************************************
   // LATENCY
   //* **************************************************************************************
   //* **************************************************************************************

  /**
   * ### Assert the response time latency
   * Ensure the response time is lower than the given time (in microseconds)
   *
   * @category Latency
   *
   * @example
   * Then the response time < 100 ms
   *
   * @function httpLatency
   */
  [
    "response time < {int} ms",
    then.httpTiming,
    "Check the response latency",
    "api, response, time, timing, latency"
  ],

   //* **************************************************************************************
   //* **************************************************************************************
   // RESPONSE HEADERS
   //* **************************************************************************************
   //* **************************************************************************************


  /**
   * ### Assert a header value
   * Ensure a response header equals the expect value
   *
   * @category Headers
   *
   * @example
   * Then header "Content-Type" = "application/json"
   *
   * @function header
   */
  [
    "header {string} = {string}",
    then.headerValueEqual,
    "Check if a property in the response header has the exact string value",
    "api, response, table, headers, header"
  ],

  /**
   * ### Assert multiple headers
   * Ensure a response header equals the list of values
   *
   * @category Headers
   *
   * @example
   * Then headers:
   *   | Content-Type   | application/json |
   *   | Content-Length | 1458             |
   *
   * @example <caption>Using placeholders</caption>
   * Then headers:
   *   | Content-Type   | {{ contentType}} |
   *   | Content-Length | 1458             |
   *
   *
   * @function headers
   */
  [
    "headers:",
    then.headers,
    "Check multiple response headers (table format)",
    "api, response, table, headers, header"
  ],

  /**
   * ### Assert if a header exists
   * Ensure a response header contains one specific property
   *
   * @category Headers
   *
   * @example
   * Then headers include "Content-Length"
   * Then headers include "X-response-time"
   *
   *
   * @function headersContains
   */
  [
    "headers include {string}",
    then.headerValueExist,
    "Check if a property is in the response header",
    "api, response, table, headers, header"
  ],

  /**
   * ### Assert if a header doesn't exist
   * Ensure a response header doesn't contain one specific property
   *
   * @category Headers
   *
   * @example
   * Then headers not include "X-response-time"
   * Then headers not include "poweered-by"
   *
   *
   * @function headersNotContains
   */
  [
    "headers not include {string}",
    then.headerValueNotExist,
    "Check if a property is in the response header",
    "api, response, table, headers, header"
  ],

   //* **************************************************************************************
   //* **************************************************************************************
   // RESPONSE BODY
   //* **************************************************************************************
   //* **************************************************************************************

  /**
   * ### Assert the full response body
   * Verify the response body against a JSON object
   *
   * @category JSON Response body
   *
   * @example
   * Then body:
   * """
   *   {
   *     "firstName": "John"
   *   }
   * """
   *
   * @function bodyJson
   */
  [
    "the body:",
    then.shouldBeJsonBody,
    "Check if the response body is equal to the passed json body",
    "api, response, body, jsonpath, dot-object, jsonbody, generator"
  ],

  /**
   * ### Assert a response body value
   * Ensure a JSON response body equals a given value at the JSON path. Equality is determined
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then "id" = 10
   * Then "user.firstname" = "john"
   * Then "user.lastname" = {{ lastname }}
   *
   * @example <caption>Using json path</caption>
   * Then "$.id" = 10
   * Then "$.user.firstname" = "john"
   * Then "$.user.lastname" = {{ lastname }}
   *
   * @function bodyPropertyEqual
   */
  [
    "{string} = {data}",
    then.shouldBeString,
    "Check a value in the body response as a string (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, data"
  ],
  [
    "{string} = {string}",
    then.shouldBeString,
    "Check a value in the body response as a string (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, string"
  ],
  [
    "{string} = {float}",
    then.shouldBeNumber,
    "Check a value in the body response as a int (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, number"
  ],

  /**
   * ### Assert a response body value not equal
   * Ensure a JSON response body not equals a given value at the JSON path. Equality is not determined
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then "id" != 10
   * Then "user.firstname" != "john"
   * Then "user.lastname" != {{ lastname }}
   *
   * @example <caption>Using json path</caption>
   * Then "$.id" != 10
   * Then "$.user.firstname" != "john"
   * Then "$.user.lastname" != {{ lastname }}
   *
   * @function bodyPropertyNotEqual
   */
  [
    "{string} != {data}",
    then.shouldNotBeEqual,
    "Invalidate a value in the body response as a string (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, data"
  ],
  [
    "{string} != {string}",
    then.shouldNotBeEqual,
    "Invalidate a value in the body response as a string (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, string"
  ],
  [
    "{string} != {float}",
    then.shouldNotBeEqual,
    "Invalidate a value in the body response as a int (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, number"
  ],

  /**
   * ### Assert a response body value equal an object
   * Verify a specific property from the response body against a JSON object or a multiline text
   *
   * @category JSON Response body
   *
   * @example
   * Then "$.person" equals:
   * """
   *   {
   *     "firstName": "John",
   *     "lastName": "Doe"
   *   }
   * """
   *
   * @example
   * Then "$.person" equals:
   * """
   * John
   * Doe
   * """
   *
   * @function bodyPropertyMultiline
   */
  [
    "{string} equals:",
    then.shouldBePropertyMultiline,
    "Check a value in the body response as a json (dot-object or jsonpath pattern)",
    "api, response, body, jsonpath, dot-object, json"
  ],

  /**
   * ### Assert a response body value is true
   * Ensure a JSON response body equals a given boolean value as true
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then "active" is true
   *
   * @example <caption>Using json path</caption>
   * Then "$.active" is true
   *
   * @function bodyPropertyEqualTrue
   */
  [
    "{string} is true",
    then.shouldBeTrue,
    "Check if a value is true in the body response (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, true, boolean"
  ],

  /**
   * ### Assert a response body value is false
   * Ensure a JSON response body equals a given boolean value as false
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then "active" is false
   *
   * @example <caption>Using json path</caption>
   * Then "$.active" is false
   *
   * @function bodyPropertyEqualFalse
   */
  [
    "{string} is false",
    then.shouldBeFalse,
    "Check if a value is false in the body response (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, false, boolean"
  ],

  /**
   * ### Assert a response body value is null
   * Ensure a JSON response body equals a given null value
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then "active" is null
   *
   * @example <caption>Using json path</caption>
   * Then "$.active" is null
   *
   * @function bodyPropertyEqualNull
   */
  [
    "{string} is null",
    then.shouldBeNull,
    "Check if a value is null in the body response (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, null"
  ],

  /**
   * ### Assert a response body value is empty
   * Ensure a JSON response body equals an empty string
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then "active" is empty
   *
   * @example <caption>Using json path</caption>
   * Then "$.active" is empty
   *
   * @function bodyPropertyEqualEmpty
   */
  [
    "{string} is empty",
    then.shouldBeEmpty,
    "Check if a value is empty in the body response (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, empty"
  ],

  /**
   * ### Assert a response body value is an array
   * Ensure a JSON response body equals an array type
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then "user.list" is an array
   *
   * @example <caption>Using json path</caption>
   * Then "$.user.list" is an array
   *
   * @function bodyPropertyIsArray
   */
  [
    "{string} is an array",
    then.shouldBeAnArray,
    "Check if a value is an array in the body response (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, array"
  ],

  /**
   * ### Assert a response body value is an array contain X items
   * Ensure a JSON response body equals an array containing a given items
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then "user.list" is an array of 10 items
   *
   * @example <caption>Using json path</caption>
   * Then "$.user.list" is an array of 10 items
   *
   * @function bodyPropertyIsArrayOfLenght
   */
  [
    "{string} is an array of {int} items",
    then.shouldBeAnArrayOfXItems,
    "Check if a value is an array of a few items in the body response (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, array, array-items"
  ],



  /**
   * ### Assert the response body is an empty array
   * Ensure a response body contains an empty array
   *
   * @category JSON Response body
   *
   * @example
   * Then body []
   *
   * @function emptyArray
   */
  [
    "body = []",
    then.shouldBeEmptyArrayResponse,
    "Check a value in the body response that it is empty array",
    "api, response, body, array"
  ],

  /**
   * ### Assert the response body is not an empty array
   * Ensure a response body doesn't contain an empty array
   *
   * @category JSON Response body
   *
   * @example
   * Then body = [] (not empty}
   *
   * @function notEmptyArray
   */
  [
    "body = [] \\(not empty)",
    then.shouldNotBeEmptyArrayResponse,
    "Check if the response list is not empty",
    "api, response, body, jsonpath, dot-object, array"
  ],

  /**
   * ### Assert the response body is empty
   * Ensure a response body is empty
   *
   * @category JSON Response body
   *
   * @example
   * Then no body
   *
   * @function emptyResponse
   */
  [
    "no body",
    then.shouldBeEmptyResponse,
    "Check if the response body is empty",
    "api, response, body"
  ],

  /**
   * ### Assert a response body value (time) is close to now
   * Ensure a JSON response body has a time set close to now ( -/+ 1 minute)
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then "user.createdAt"<time> is close to now
   *
   * @example <caption>Using json path</caption>
   * Then "$.user.list"<time> is close to now
   *
   * @function bodyPropertyIsATimeCloseToNow
   */
  [
    "{string}<time> is close to now",
    then.shouldBeNow,
    "Check if a date is close to now (ex: to check if a createdAt date is valid)",
    "api, response, body, jsonpath, dot-object, now"
  ],

  /**
   * ### Assert a response body value is not null
   * Ensure a JSON response body has a time set close to now ( -/+ 1 minute)
   * Ensure a JSON response body is not null
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then "user.children" is not null
   *
   * @example <caption>Using json path</caption>
   * Then "$.user.childern" is not null
   *
   * @function bodyPropertyIsNotNull
   */
  [
    "{string} is not null",
    then.shouldNotBeNull,
    "Check if a value is not null in the body response (dot-object pattern)",
    "api, response, body, jsonpath, dot-object, null"
  ],

  /**
   * ### Assert a response body value match a regexp
   * Ensure a JSON response body matches a given regexp
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then "user.occupation" match "/pilot/"
   *
   * @example <caption>Using json path</caption>
   * Then "$.user.occupation" match "/pilot/"
   *
   * @function bodyPropertyShouldMatchRegexp
   */
  [
    "{string} match {string}",
    then.shouldMatch,
    "Check if a value match a specific regex",
    "api, response, body, jsonpath, dot-object, regexp, regex"
  ],

  /**
   * ### Assert a response body (array) contains X items
   * Ensure a JSON response body has an array at the root level an contains a given number of items
   *
   * @category JSON Response body
   *
   * @example <caption>Using dot object</caption>
   * Then body<array> contains 12 items
   *
   * @function bodyListContainNumberOfItem
   */
  [
    "body<array> contains {int} items",
    then.shouldBeArraySize,
    "Check if the response list is of a certain size",
    "api, response, body, jsonpath, dot-object, array-body"
  ],

  /**
   * ### Assert a response body value (number) is greater than
   * Verify if a specific value from the response body is greater than the expected value
   *
   * @category Sort Numeric
   *
   * @example
   * Then "$.person.age"<number> > 10
   *
   * @example <caption>Placeholder from datasets</caption>
   * Then "$.person.age"<number> > {{ age }}
   *
   * @function greaterThan
   */
  [
    "{string}<number> > {float}",
    then.shouldBeGreaterThan,
    "Check if a value in the response body is greater than an expected value",
    "api, response, body, jsonpath, dot-object, number, numeric"
  ],
  [
    "{string}<number> > {data}",
    then.shouldBeGreaterThan,
    "Check if a value in the response body is greater than an expected value (placeholder)",
    "api, response, body, jsonpath, dot-object, number, numeric"
  ],

  /**
   * ### Assert a response body value (number) is less than
   * Verify if a specific value from the response body is less than an expected value
   *
   * @category Sort Numeric
   *
   * @example
   * Then "$.person.age"<number> < 10
   *
   * @example <caption>Placeholder from datasets</caption>
   * Then "$.person.age"<number> < {{ age }}
   *
   * @function lessThan
   */
  [
    "{string}<number> < {float}",
    then.shouldBeLessThan,
    "Check if a value in the response body is less than an expected value",
    "api, response, body, jsonpath, dot-object, number, numeric"
  ],
  [
    "{string}<number> < {data}",
    then.shouldBeLessThan,
    "Check if a value in the response body is less than an expected value (placeholder)",
    "api, response, body, jsonpath, dot-object, number, numeric"
  ],

  /**
   * ### Assert a response body value (number) is greater or equal than
   * Verify if a specific value from the response body is greater than or equal to an expected value
   *
   * @category Sort Numeric
   *
   * @example
   * Then "$.person.age"<number> >= 10
   *
   * @example <caption>Placeholder from datasets</caption>
   * Then "$.person.age"<number> >= {{ age }}
   *
   * @function greaterThanOrEqualTo
   */
  [
    "{string}<number> >= {float}",
    then.shouldBeGreaterThanOrEqualTo,
    "Check if a value in the response body is greater than or equal to an expected value",
    "api, response, body, jsonpath, dot-object, number, numeric"
  ],
  [
    "{string}<number> >= {data}",
    then.shouldBeGreaterThanOrEqualTo,
    "Check if a value in the response body is greater than or equal to an expected value (placeholder)",
    "api, response, body, jsonpath, dot-object, number, numeric"
  ],

  /**
   * ### Assert a response body value (number) is lesser or equal than
   * Verify if a specific value from the response body is less than or equal to an expected value
   *
   * @category Sort Numeric
   *
   * @example
   * Then "$.person.age"<number> <= 10
   *
   * @example <caption>Placeholder from datasets</caption>
   * Then "$.person.age"<number> <= {{ age }}
   *
   * @function lessThanOrEqualTo
   */
  [
    "{string}<number> <= {float}",
    then.shouldBeLessThanOrEqualTo,
    "Check if a value in the response body is less than or equal to an expected value",
    "api, response, body, jsonpath, dot-object, number, numeric"
  ],
  [
    "{string}<number> <= {data}",
    then.shouldBeLessThanOrEqualTo,
    "Check if a value in the response body is less than or equal to an expected value (placeholder)",
    "api, response, body, jsonpath, dot-object, number, numeric"
  ],

  /**
   * ### Assert a response body value (date) is before an expected date
   * Verify and compare if a specific date from the response body comes before the expected date
   * The expected date should follow the pattern 'YYYY/MM/DD' (reference: RFC2822)
   *
   * @category Date
   *
   * @example
   * Then "$.createdAt"<date> < "2020/12/01"
   * Then "$.createdAt"<date> < "2020/12/01 23:30:00"
   *
   * @example <caption>Placeholder from datasets</caption>
   * Then "$.createdAt"<date> < {{ my-date }}
   *
   * @function DateBefore
   */
  [
    "{string}<date> < {string}",
    then.shouldBeDateBefore,
    "Check if a date from the response body is before the expected date",
    "api, response, body, jsonpath, dot-object, date"
  ],
  [
    "{string}<date> < {data}",
    then.shouldBeDateBefore,
    "Check if a date from the response body is before the expected date (placeholder)",
    "api, response, body, jsonpath, dot-object, date"
  ],

  /**
   * ### Assert a response body value (date) is before today
   * Verify and compare if a specific date from the response body is comes before the current day
   *
   * @category Date
   *
   * @example
   * Then "$.createdAt"<date> < today
   *
   * @function DateBeforeToday
   */
  [
    "{string}<date> < today",
    then.shouldBeDateBeforeToday,
    "Check if a date from the response body is before the current day",
    "api, response, body, jsonpath, dot-object, date, today"
  ],

  /**
   * ### Assert a response body value (date) is after an expected date
   * Verify and compare if a specific date from the response body comes after an expected date
   * The expected date should follow the pattern 'YYYY/MM/DD' (reference: RFC2822)
   *
   * @category Date
   *
   * @example
   * Then "$.createdAt"<date> > "2020/12/01"
   * Then "$.createdAt"<date> > "2020/12/01 23:30:00"
   *
   * @example <caption>Placeholder from datasets</caption>
   * Then "$.createdAt"<date> > {{ my-date }}
   *
   * @function DateAfter
   */
  [
    "{string}<date> > {string}",
    then.shouldBeDateAfter,
    "Check if a date from the response body is after an expected date",
    "api, response, body, jsonpath, dot-object, date"
  ],
  [
    "{string}<date> > {data}",
    then.shouldBeDateAfter,
    "Check if a date from the response body is after an expected date (placeholder)",
    "api, response, body, jsonpath, dot-object, date"
  ],

  /**
   * ### Assert a response body value (date) is after today
   * Verify and compare if a specific date from the response body comes after the current day
   *
   * @category Date
   *
   * @example
   * Then "$.createdAt"<date> > today
   *
   * @function DateAfterToday
   */
  [
    "{string}<date> > today",
    then.shouldBeDateAfterToday,
    "Check if a date from the response body is after the current day",
    "api, response, body, jsonpath, dot-object, date, today"
  ],

  /*
   * ### Assert the response body match a json schema (file)
   * Validate the format of the response body using the [JSON Schema](https://json-schema.org/) definition.
   * The JSON need to be defined on a .json file.
   * In order to use this feature you need to specify the location of you test data storage.
   * The validation is based on the [Ajv](https://ajv.js.org/), feel free to look at the options.
   *
   * @category Validation
   *
   * @example
   * Then body json schema from "person.json"<file>
   *
   * @example <caption>Placeholder from datasets</caption>
   * Then body json schema from {{ file }}<file>
   *
   * @function jsonschema
   */
  [
    "body json schema from {string}<file>",
    then.shouldMatchJsonSchema,
    "Check if a value in the response body is less than or equal to an expected value",
    "api, response, body, jsonpath, dot-object, schema, json-schema, jsonschema"
  ],
  [
    "body json schema from {data}<file>",
    then.shouldMatchJsonSchema,
    "Check if a value in the response body is less than or equal to an expected value (placeholder)",
    "api, response, body, jsonpath, dot-object, schema, json-schema, jsonschema"
  ],

  /**
   * ### Assert a response body value match a json schema (file)
   * Validate the format of a specific value from the response body using the [JSON Schema](https://json-schema.org/) definition.
   * The JSON need to be defined on a .json file.
   * In order to use this feature you need to specify the location of you test data storage.
   * The validation is based on the [Ajv](https://ajv.js.org/), feel free to look at the options.
   *
   * @category Validation
   *
   * @example
   * Then body "$.person" json schema from "person.json"<file>
   *
   * @example <caption>Placeholder from datasets</caption>
   * Then body "$.person" json schema from {{ file }}<file>
   *
   * @function jsonschema
   */
  [
    "body {string} json schema from {string}<file>",
    then.shouldMatchPropertyJsonSchema,
    "Check if a value in the response body is a JSON schema definition",
    "api, response, body, jsonpath, dot-object, schema, json-schema, jsonschema"
  ],
  [
    "body {string} json schema from {data}<file>",
    then.shouldMatchPropertyJsonSchema,
    "Check if a value in the response body is a JSON schema definition (placeholder)",
    "api, response, body, jsonpath, dot-object, schema, json-schema, jsonschema"
  ],

  // Response Dataset

  /**
   * ### Add a response header value to the dataset
   * Pick of the reponse header value and add it into the dataset storage
   * This will allow you to reuse value in another step
   *
   * @category Dataset
   *
   * @example
   * Then add "Content-Type" from the header to dataset as "contentType"
   * Given a request
   *   And the headers:
   *   | Content-Type | {{ contentType }} |
   *
   *
   * @function saveHeaderPropertyIntoTheDataset
   */
  [
    "add {string} from the header to the dataset as {string}",
    then.addHeaderPropertyToDataset,
    "Take on of the value from the response header and add it to the dataset",
    "api, response, header, jsonpath, dot-object, dataset"
  ],

  /**
   * ### Add a response body value to the dataset
   * Pick of the reponse body value and add it into the dataset storage
   * This will allow you to reuse value in another step
   *
   * @category Dataset
   *
   * @example <caption>Using dot object</caption>
   * Then add "user.id" from the body to the dataset as "userId"
   * Given a request
   * When GET "/users/{{userId}}"
   *
   * @example <caption>Using json path</caption>
   * Then add "$.user.id" from the body to the dataset as "userId"
   * Given a request
   * When GET "/users/{{userId}}"
   *
   * @function saveBodyPropertyIntoTheDataset
   */
  [
    "add {string} from the body to the dataset as {string}",
    then.addBodyPropertyToDataset,
    "Take on of the value from the response body and add it to the dataset",
    "api, response, body, jsonpath, dot-object, dataset"
  ],

  /**
   * ### Add a cookie to the Jar
   * Add the cookie into the Jar 🍪
   *
   * @category Cookie
   *
   * By adding the cookie into the jar the following request will contains the cookie into the header
   *
   * @example
   * Then save cookie in jar
   *
   * @function cookiejar
   */
  [
    "save cookie in jar",
    then.cookieJar,
    "Add the cookie from the response the a storage to get reused on the next call",
    "api, cooke, jar"
  ]
];
