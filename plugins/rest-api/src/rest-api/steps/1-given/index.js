const given = require("./functions");

/**
 * All the steps related to the API Request
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
   * ### Given I have the api gateway
   * Define the api gateway host (take a look at the config file).
   *
   * @category Host
   *
   * @example
   * Given I have the api gateway
   *
   *
   * @function gateway
   */
  [
    "I have the api gateway",
    given.gateway,
    "Create a new api request targeting the default api gateway",
    "api, url, gateway, generator"
  ],

  /**
   * ### Given I have the api gateway hosted on {string}
   * Define the api gateway hosted on the given on the specific api gateway
   *
   * @category Host
   *
   * @example <caption>If you want to use a specific host you can use</caption>
   * Given I have the api gateway hosted on "https://api.example.com"
   *
   *
   * @function gateway
   */
  [
    "I have the api gateway hosted on {string}",
    given.gatewayHost,
    "Create a new api request targeting on a given api gateway",
    "api, url, host, generator"
  ],

  // SSL

  /**
   * ### Given I want to ignore the ssl certificate
   * Define if you want to ignore the ssl certificate for the current request
   *
   * @category Host
   *
   * @example
   * Given I want to ignore the ssl certificate
   *
   * @function ssl
   */
  [
    "I want to ignore the ssl certificate",
    given.ssl,
    "Ignore ssl certification, in case of invalidation, expiration etc...",
    "request, ssl, api, generator"
  ],

  // Path + method

  /**
   * ### Given I have the path {string}
   * Define the request path
   * placeholder can be used within the path for dynamic call (ex: /users/{{userid}})
   *
   * @category Path
   *
   * @example
   * Given I have the path "/users/1"
   * Given I have the path "/users/1/addresses"
   * Given I have the path "/users/{{ userId }}/addresses"
   *
   * @function path
   */
  [
    "I have the path {string}",
    given.path,
    "add the path of the request (ex: /quotes)",
    "request, path, api, generator"
  ],

  /**
   * ### Given I have the method {string}
   * Define the request method (default GET)
   * Available : GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD
   *
   * @category Method
   *
   * @example
   * Given I have the method "PATCH"
   *
   * @function method
   */
  [
    "I have the method {string}",
    given.method,
    "add the method to the request (ex: POST)",
    "request, method, api, generator"
  ],

  /**
   * ### Given I send a {string} request to {string}
   * Construct a request to a resource using an HTTP method
   *
   * @category Method
   *
   * @example
   * Given I send a "GET" request to "/customers"
   * Given I send a "POST" request to "/customers"
   * Given I send a "PUT" request to "/customers/1234"
   * Given I send a "DELETE" request to "/customers/1234"
   *
   * @function methodPath
   */
  [
    "I send a {string} request to {string}",
    given.methodPath,
    "add the method and the path of the request",
    "request, method, path, api"
  ],

  //  ****************************************************************************************************
  //  Headers
  //  ****************************************************************************************************

  /**
   * ### Given the header contains {string} as {string}
   * Set one request header
   *
   * @category Headers
   *
   * @example
   * Given the header contains "Content-Type" as "application/json"
   * Given the header contains "Accept-language" as "en"
   * Given the header contains "user-agent" as "curl"
   *
   * @example <caption>Placeholder from datasets</caption>
   * Given the header contains "Accept-language" as {{ language }}
   * Given the header contains "user-agent" as {{ currentUserAgent }}
   *
   * @function header
   */
  [
    "the header contains {string} as {data}",
    given.header,
    'add a placeholded value to request headers  (ex "apikey" -> {{ apikey }})',
    "request, headers"
  ],
  [
    "the header contains {string} as {string}",
    given.header,
    'add a string value to request headers (ex "x-correlation-id" -> "xxxx-xxxxx-1111-2222")',
    "request, headers, generator"
  ],

  /**
   * ### Given I add the headers:
   * Set one or more request headers in a single step.
   *
   * @category Headers
   *
   * @example
   * Given I add the headers:
   *   | Content-Type     | application/json |
   *   | Accept-Language  | en               |
   *
   * @example <caption>Placeholder from datasets</caption>
   * Given I add the headers:
   *   | Content-Type     | {{contentType}} |
   *   | Accept-Language  | {{ language }}  |
   *
   * @function headers
   */
  [
    "I add the headers:",
    given.headers,
    "Adding multiple headers to the request (table format)",
    "request, headers, table"
  ],

  /**
   * ### Given I have the bearer token {string}
   * Set the bearer token into the authorization headers
   *
   * @category Authorization
   *
   * @example
   * Given I have the bearer token "xxx-yyy-zzz"
   *
   * @example <caption>Placeholder from datasets</caption>
   * Given I have the bearer token {{ token }}
   *
   * @function AuthorizatioinHeaderBearerToken
   */
  [
    "I have the bearer token {data}",
    given.bearer,
    'Set a placeholded bearer token into the authorization header (ex: "token" -> {{ token }})',
    "request, headers, authorization, bearer"
  ],
  [
    "I have the bearer token {string}",
    given.bearer,
    "Set the bearer token into the authorization header",
    "request, headers, authorization, bearer"
  ],

  /**
   * ### Given I use basic access authentication using the username {string} and the password {string}
   * Set the basic authentication into the authorization headers
   *
   * @category Authorization
   *
   * @example
   * Given I use basic access authentication using the username "foo" and the password "bar"
   * Given I have the basic auth user "foo" pass "bar"
   * Given I use basic auth with "foo" / "bar"
   *
   * @example <caption>Placeholder from datasets</caption>
   * Given I use basic access authentication using the username "foo" and the password "bar"
   * Given I have the basic auth user "foo" pass "bar"
   * Given I use basic auth with "foo" / "bar"
   *
   * @function AuthorizatioinHeaderBasicAuth
   */
  [
    "I use basic access authentication using the username {string} and the password {string}",
    given.basicAuth,
    "Set the basic auth into the authorization request header",
    "request, authorization, basic auth"
  ],
  [
    "I use basic access authentication using the username {data} and the password {string}",
    given.basicAuth,
    "Set the basic auth into the authorization request header (placeholder)",
    "request, authorization, basic auth"
  ],
  [
    "I use basic access authentication using the username {string} and the password {data}",
    given.basicAuth,
    "Set the basic auth into the authorization request header (placeholder)",
    "request, authorization, basic auth"
  ],
  [
    "I use basic access authentication using the username {data} and the password {data}",
    given.basicAuth,
    "Set the basic auth into the authorization request header (placeholder)",
    "request, authorization, basic auth"
  ],
  [
    "I have the basic auth user {string} pass {string}",
    given.basicAuth,
    "Set the basic auth into the authorization request header",
    "request, authorization, basic auth, generator"
  ],
  [
    "I have the basic auth user {string} pass {data}",
    given.basicAuth,
    "Set the basic auth into the authorization request header (placeholder)",
    "request, authorization, basic auth"
  ],
  [
    "I have the basic auth user {data} pass {string}",
    given.basicAuth,
    "Set the basic auth into the authorization request header (placeholder)",
    "request, authorization, basic auth"
  ],
  [
    "I have the basic auth user {data} pass {data}",
    given.basicAuth,
    "Set the basic auth into the authorization request header (placeholder)",
    "request, authorization, basic auth"
  ],
  [
    "I use basic auth with {string} \\/ {string}",
    given.basicAuth,
    "Set the basic auth into the authorization request header (placeholder)",
    "request, authorization, basic auth"
  ],
  [
    "I use basic auth with {data} \\/ {string}",
    given.basicAuth,
    "Set the basic auth into the authorization request header (placeholder)",
    "request, authorization, basic auth"
  ],
  [
    "I use basic auth with {string} \\/ {data}",
    given.basicAuth,
    "Set the basic auth into the authorization request header (placeholder)",
    "request, authorization, basic auth"
  ],
  [
    "I use basic auth with {data} \\/ {data}",
    given.basicAuth,
    "Set the basic auth into the authorization request header (placeholder)",
    "request, authorization, basic auth"
  ],

  //  ****************************************************************************************************
  //  Query String
  //  ****************************************************************************************************

  /**
   * ### Given the query parameter contains {string} as {string}
   * Set one or more request query parameters (example: /pets?price=10&name=john)
   *
   * @category Query string
   *
   * @example <caption>string</caption>
   * Given the query parameter contains "sort" as "price"
   * Given the query parameter contains "name" as "john"
   *
   * @example <caption>number</caption>
   * Given the query parameter contains "limit" as 10
   * Given the query parameter contains "offset" as 30
   *
   * @example <caption>Placeholder from datasets</caption>
   * Given the query parameter contains "sort" as {{ price }}
   * Given the query parameter contains "name" as {{ name }}
   *
   * @function queryString
   */
  [
    "the query parameter contains {string} as {data}",
    given.queryString,
    'add a placeholded value to request query parameter (ex "gender" : {{ gender }} for "gender=1")',
    "request, query string, qs"
  ],
  [
    "the query parameter contains {string} as {string}",
    given.queryString,
    'add a string value to request query parameter  (ex "gender" : "MALE" for "gender=MALE")',
    "request, query string, qs, generator"
  ],
  [
    "the query parameter contains {string} as {float}",
    given.queryString,
    'add a string value to request query parameter (ex "gender" : "1" for "gender=1")',
    "request, query string, qs"
  ],

  /**
   * ### Given I add the query string parameters:
   * Set one or more request query parameter in a single step.
   *
   * @category Query string
   *
   * @example
   * Given I add the query string parameters:
   *   | sort     | price |
   *   | name     | john  |
   *
   * @example <caption>Placeholder from datasets</caption>
   * Given I add the query string parameters:
   *   | sort     | {{ sort }} |
   *   | name     | {{ name }}  |
   *
   * @function queriesString
   */
  [
    "I add the query string parameters:",
    given.qs,
    "Adding multiple query parameters to the request (table format)",
    "request, query string, qs, table"
  ],

  //  ****************************************************************************************************
  //  JSON REQUEST BODY
  //  ****************************************************************************************************

  /**
   * ### Given the payload contains {string} as {string | int | float | placeholder | data}
   * Set one or more request json body (support dot-object or jsonpath property)
   *
   * @category JSON Request body
   *
   * @example <caption>string</caption>
   * Given the payload contains "firstname" as "john"
   * Given the payload contains "lastname" as "doe"
   * Given the payload contains "people.lastname" as "doe"
   *
   * @example <caption>int</caption>
   * Given the payload contains "limit" as 10
   * Given the payload contains "offset" as 30
   * Given the payload contains "page.offset" as 30
   *
   * @example <caption>float</caption>
   * Given the payload contains "size" as 1.1
   * Given the payload contains "weight" as 1.0
   * Given the payload contains "body.weight" as 1.0
   *
   * @example <caption>Placeholder form from datasets</caption>
   * Given the payload contains "sort" as {{ price }}
   * Given the payload contains "name" as {{ name }}
   * Given the payload contains "list.name" as {{ name }}
   *
   * @function JsonPayload
   */
  [
    "the payload contains {string} as {data}",
    given.payload,
    'add a property with placeholded value to the request body, the pattern used is dot-object  ( ex: "quotes.detail.id" -> {{quoteId}})',
    "request, body, restqdata"
  ],
  [
    "the payload contains {string} as {string}",
    given.payload,
    'add a property with string value to the request body, the pattern used is dot-object  ( ex: "quotes.detail.id" -> "ASD12355")',
    "request, body, dot"
  ],
  [
    "the payload contains {string} as {float}",
    given.payload,
    'add a property with int value to the request body, the pattern used is dot-object  ( ex: "quotes.detail.amount" -> 200)',
    "request, body, dot"
  ],

  /**
   * ### Given the payload contains {string} as null
   * Set a value as null in the json request body (support dot-object or jsonpath property)
   *
   * @category JSON Request body
   *
   * @example
   * Given the payload contains "firstname" as null
   * Given the payload contains "user.firstname" as null
   *
   * @function JsonPayloadNull
   */
  [
    "the payload contains {string} as null",
    given.payloadNull,
    'add a property with null value to the request body, the pattern used is dot-object  ( ex: "quotes.detail.amount" -> null)',
    "request, body, null"
  ],

  /**
   * ### Given the payload contains {string} as true
   * Set a value as true in the json request body (support dot-object or jsonpath property)
   *
   * @category JSON Request body
   *
   * @example
   * Given the payload contains "active" as true
   * Given the payload contains "user.active" as true
   *
   * @function JsonPayloadTrue
   */
  [
    "the payload contains {string} as true",
    given.payloadTrue,
    'active" -> true',
    "request, body, boolean"
  ],

  /**
   * ### Given the payload contains {string} as false
   * Set a value as false in the json request body (support dot-object or jsonpath property)
   *
   * @category JSON Request body
   *
   * @example
   * Given the payload contains "active" as false
   * Given the payload contains "user.active" as false
   *
   * @function JsonPayloadFalse
   */
  [
    "the payload contains {string} as false",
    given.payloadFalse,
    'active" -> false',
    "request, body, boolean"
  ],

  /**
   * ### Given the payload contains {string} as empty array
   * Set a value as empty array in the json request body (support dot-object or jsonpath property)
   *
   * @category JSON Request body
   *
   * @example
   * Given the payload contains "list" as empty array
   * Given the payload contains "user.list" as empty array
   *
   * @function JsonPayloadEmptyArray
   */
  [
    "the payload contains {string} as empty array",
    given.payloadEmptyArray,
    "add property with empty array to the request body",
    "request, body, array"
  ],

  /**
   * ### Given I add the request body:
   * Set one or more request body information in a single step.
   *
   * @category JSON Request body
   *
   * @example
   * Given I add the request body:
   *   | firstname | john |
   *   | lastname  | doe  |
   *
   * @example <caption>Placeholder from datasets</caption>
   * Given I add the request body:
   *   | firstname    | {{ firstName }} |
   *   | lastname     | {{ lastName }}  |
   *
   * @function JsonPayloadTable
   */
  [
    "I add the request body:",
    given.payloads,
    "Adding multiple query parameters to the request (table format)",
    "request, body, dot, table"
  ],

  /**
   * ### Given the payload:
   * Add a JSON request body included in the Gherkin doc strings
   *
   * @category JSON Request body
   *
   * @example
   * Given the payload:
   * """
   *   {
   *     "firstname": "john",
   *     "lastname": "doe"
   *   }
   * """
   *
   * @example <caption>Placeholder from datasets</caption>
   * Given the payload:
   * """
   * {
   *     "firstname": "{{ firstName }}"
   *     "lastname": "{{ lastName }}"
   * }
   * """
   *
   * @function jsonPayload
   */
  [
    "the payload:",
    given.jsonPayload,
    "Add a JSON request body included in the Gherkin doc strings",
    "request, body, dot, jsonbody, generator"
  ],

  /**
   * ### Given the payload from a file stored at {string}
   * Add a JSON request body from a json file
   * Do not forget to specify the `data.storage` option into your configuration to specify the file location
   *
   * @category JSON Request body
   *
   * @example
   * Given the payload from a file stored at "my-body.json"
   *
   * @example <caption>Placeholder from datasets</caption>
   * Given the payload from a file stored at {{ filename }}
   *
   * @function jsonFilePayload
   */
  [
    "the payload from a file stored at {string}",
    given.jsonFilePayload,
    "Add a JSON request body from a json file",
    "request, body, dot, file, jsonbody"
  ],
  [
    "the payload from a file stored at {data}",
    given.jsonFilePayload,
    "Add a JSON request body from a json file (placeholder)",
    "request, body, dot, file, jsonbody"
  ],

  //  ****************************************************************************************************
  //  FORM REQUEST BODY
  //  ****************************************************************************************************

  /**
   * ### Given I add the form value {string} as {string | int | float | placeholder | data}
   * Set one or more request form body
   *
   * @category Form Request body
   *
   * @example <caption>string</caption>
   * Given I add the form value "firstname" as "john"
   * Given I add the form value "lastname" as "doe"
   * Given I add the form value "people.lastname" as "doe"
   *
   * @example <caption>int</caption>
   * Given I add the form value "limit" as 10
   * Given I add the form value "offset" as 30
   * Given I add the form value "page.offset" as 30
   *
   * @example <caption>float</caption>
   * Given I add the form value "size" as 1.1
   * Given I add the form value "weight" as 1.0
   * Given I add the form value "body.weight" as 1.0
   *
   * @example <caption>Placeholder form from datasets</caption>
   * Given I add the form value "sort" as {{ price }}
   * Given I add the form value "name" as {{ name }}
   * Given I add the form value "list.name" as {{ name }}
   *
   * @function FormBody
   */
  [
    "I add the form value {string} as {string}",
    given.form,
    "Adding value into form request body",
    "request, body, form, generator"
  ],
  [
    "I add the form value {string} as {float}",
    given.form,
    "Adding value into form request body",
    "request, body, form, float"
  ],
  [
    "I add the form value {string} as {data}",
    given.form,
    "Adding placeholded value into form request body",
    "request, body, form"
  ],

  /**
   * ### Given I add the form value {string} as a file stored at {string | placeholder | data}
   * Set one or more request form body
   * Do not forget to specify the `data.storage` option into your configuration to specify the file location
   *
   * @category Form Request body
   *
   * @example <caption>string</caption>
   * Given I add the form value "file" as a file stored at "avatar.png"
   *
   * @example <caption>Placeholder form from datasets</caption>
   * Given I add the form value "file" as a file stored at {{ filename }}
   *
   * @function FormBody
   */
  [
    "I add the form value {string} as a file stored at {string}",
    given.formUpload,
    "Adding a file into for request body",
    "request, body, form, upload, file"
  ],
  [
    "I add the form value {string} as a file stored at {data}",
    given.formUpload,
    "Adding a placehoded filename into for request body",
    "request, body, form, upload, file"
  ],

  /**
   * ### Given I add the form values:
   * Set one or more request form body information in a single step.
   *
   * @category Form Request body
   *
   * @example
   * Given I add the form values:
   *   | firstname | john |
   *   | lastname  | doe  |
   *
   * @example <caption>Placeholder from datasets</caption>
   * Given I add the form values:
   *   | firstname    | {{ firstName }} |
   *   | lastname     | {{ lastName }}  |
   *
   * @function FormBodyTable
   */
  [
    "I add the form values:",
    given.forms,
    "Adding multiple values to the form request body (table format)",
    "request, body, form, table"
  ]
];
