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
   * ### Initiate a request
   * Define a new API request (MANDATORY)
   *
   * @category Host
   *
   * @example
   * Given a request
   *
   *
   * @function gateway
   */
  [
    "a request",
    given.gateway,
    "Create a new api request targeting the current service",
    "api, url, gateway, generator"
  ],

  /**
   * ### Initiate a request on a specific host
   * Define a new API request but on a different host than the default service
   *
   *
   * @category Host
   *
   * @example <caption>If you want to use a specific host you can use</caption>
   * Given a request hosted on "https://api.example.com"
   *
   *
   * @function gateway
   */
  [
    "a request hosted on {string}",
    given.gatewayHost,
    "Create a new api request targeting on a given api gateway",
    "api, url, host, generator"
  ],

  // SSL

  /**
   * ### Define if request should ignore ssl certificate
   * Define if you want to ignore the ssl certificate for the current request
   *
   * @category Host
   *
   * @example
   * Given ignore ssl
   *
   * @function ssl
   */
  [
    "ignore ssl",
    given.ssl,
    "Ignore ssl certification, in case of invalidation, expiration etc...",
    "request, ssl, api, generator"
  ],

  //  ****************************************************************************************************
  //  Headers
  //  ****************************************************************************************************

  /**
   * ### Define request headers
   * Set one or more request headers in a single step.
   *
   * @category Headers
   *
   * @example
   * Given the headers:
   *   | Content-Type     | application/json |
   *   | Accept-Language  | en               |
   *
   * @example <caption>Placeholder from [datasets](#/documentation/dataset)</caption>
   * Given the headers:
   *   | Content-Type     | {{contentType}} |
   *   | Accept-Language  | {{ language }}  |
   *
   * @function headers
   */
  [
    "the headers:",
    given.headers,
    "Adding multiple headers to the request (table format)",
    "request, headers, table, generator"
  ],

  /**
   * ### Define request bearer authorization
   * Set the bearer token into the authorization headers
   *
   * @category Authorization
   *
   * @example
   * Given the bearer token "xxx-yyy-zzz"
   *
   * @example <caption>Placeholder from [datasets](#/documentation/dataset)</caption>
   * Given the bearer token {{ token }}
   *
   * @function AuthorizatioinHeaderBearerToken
   */
  [
    "the bearer token {data}",
    given.bearer,
    'Set a placeholded bearer token into the authorization header (ex: "token" -> {{ token }})',
    "request, headers, authorization, bearer"
  ],
  [
    "the bearer token {string}",
    given.bearer,
    "Set the bearer token into the authorization header",
    "request, headers, authorization, bearer"
  ],

  /**
   * ### Define request basic auth authorization
   * Set the basic authentication into the authorization headers
   *
   * @category Authorization
   *
   * @example
   * Given the basic auth "foo" / "bar"
   * Given the basic auth "foo"/"bar"
   *
   * @example <caption>Placeholder from [datasets](#/documentation/dataset)</caption>
   * Given the basic auth {{user}}/{{pass}}
   * Given the basic auth {{user}} / {{pass}}
   *
   * @function AuthorizatioinHeaderBasicAuth
   */
  [
    "the basic auth {string} \\/ {string}",
    given.basicAuth,
    "Set the basic auth into the authorization request header",
    "request, authorization, basic auth, generator"
  ],
  [
    "the basic auth {data} \\/ {string}",
    given.basicAuth,
    "Set the basic auth into the authorization request header (placeholder)",
    "request, authorization, basic auth"
  ],
  [
    "the basic auth {string} \\/ {data}",
    given.basicAuth,
    "Set the basic auth into the authorization request header (placeholder)",
    "request, authorization, basic auth"
  ],
  [
    "the basic auth {data} \\/ {data}",
    given.basicAuth,
    "Set the basic auth into the authorization request header (placeholder)",
    "request, authorization, basic auth"
  ],
  [
    "the basic auth {string}\\/{string}",
    given.basicAuth,
    "Set the basic auth into the authorization request header",
    "request, authorization, basic auth"
  ],
  [
    "the basic auth {data}\\/{string}",
    given.basicAuth,
    "Set the basic auth into the authorization request header (placeholder)",
    "request, authorization, basic auth"
  ],
  [
    "the basic auth {string}\\/{data}",
    given.basicAuth,
    "Set the basic auth into the authorization request header (placeholder)",
    "request, authorization, basic auth"
  ],
  [
    "the basic auth {data}\\/{data}",
    given.basicAuth,
    "Set the basic auth into the authorization request header (placeholder)",
    "request, authorization, basic auth"
  ],

  //  ****************************************************************************************************
  //  Query String
  //  ****************************************************************************************************

  /**
   * ### Define the request query parameters
   * Set one or more request query parameter in a single step.
   *
   * @category Query string
   *
   * @example
   * Given the query strings:
   *   | sort     | price |
   *   | name     | john  |
   *
   * @example <caption>Placeholder from [datasets](#/documentation/dataset)</caption>
   * Given the query strings:
   *   | sort     | {{ sort }} |
   *   | name     | {{ name }}  |
   *
   * @function queriesString
   */
  [
    "the query strings:",
    given.qs,
    "Adding multiple query parameters to the request (table format)",
    "request, query string, qs, table, generator"
  ],

  //  ****************************************************************************************************
  //  JSON REQUEST BODY
  //  ****************************************************************************************************

  /**
   * ### Define the request body payload
   * Set one or more request query parameter in a single step.
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
   * @example <caption>Placeholder from [datasets](#/documentation/dataset)</caption>
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
   * ### Define the request body payload as table
   * Set one or more request body information in a single step.
   *
   * @category JSON Request body
   *
   * @example
   * Given the body (json):
   *   | active | true |
   *   | person.firstname | john |
   *   | person.lastname  | doe  |
   *
   * @example <caption>Placeholder from [datasets](#/documentation/dataset)</caption>
   * Given the body (json):
   *   | person.firstname    | {{ firstName }} |
   *   | person.lastname     | {{ lastName }}  |
   *
   * @function JsonPayloadTable
   */
  [
    "the body (json):",
    given.payloads,
    "Adding multiple query parameters to the request (table format)",
    "request, body, dot, table"
  ],

  /**
   * ### Define the request body payload as file
   * Add a JSON request body from a json file
   * Do not forget to specify the `data.storage` option into your configuration to specify the file location
   *
   * @category JSON Request body
   *
   * @example
   * Given the payload from a file "my-body.json"
   *
   * @example <caption>Placeholder from [datasets](#/documentation/dataset)</caption>
   * Given the payload from a file {{ filename }}
   *
   * @function jsonFilePayload
   */
  [
    "the payload from a file {string}",
    given.jsonFilePayload,
    "Add a JSON request body from a json file",
    "request, body, dot, file, jsonbody"
  ],
  [
    "the payload from a file {data}",
    given.jsonFilePayload,
    "Add a JSON request body from a json file (placeholder)",
    "request, body, dot, file, jsonbody"
  ],

  //  ****************************************************************************************************
  //  FORM REQUEST BODY
  //  ****************************************************************************************************

  /**
   * ### Define the request body payload as file
   * Set one or more request form body information in a single step.
   *
   * @category Form Request body
   *
   * @example
   * Given the body (form):
   *   | firstname | john |
   *   | lastname  | doe  |
   *
   * @example <caption>Placeholder from [datasets](#/documentation/dataset)</caption>
   * Given the body (form):
   *   | firstname    | {{ firstName }} |
   *   | lastname     | {{ lastName }}  |
   *
   * @function FormBodyTable
   */
  [
    "the body (form):",
    given.forms,
    "Adding multiple values to the form request body (table format)",
    "request, body, form, table, generator"
  ],

  /**
   * ### Given upload the file {string | placeholder | data} as form value {string}
   * Upload a document to a form. Do not forget to specify the `data.storage` option into your configuration to specify the file location
   *
   * @category Form Request body
   *
   * @example <caption>string</caption>
   * Given upload the file "avatar.png" as form value "user-img"
   *
   * @example <caption>Placeholder form from [datasets](#/documentation/dataset)</caption>
   * Given upload the file {{ filename }} as form value "user-img"
   *
   * @function FormBody
   */
  [
    "upload the file {string} as form value {string}",
    given.formUpload,
    "Adding a file into for request body",
    "request, body, form, upload, file"
  ],
  [
    "upload the file {data} as form value {string}",
    given.formUpload,
    "Adding a placehoded filename into for request body",
    "request, body, form, upload, file"
  ]
];
