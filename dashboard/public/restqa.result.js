const OUTPUT = {}

OUTPUT.RESTQA_RESULT = {
  "id": "efb6d4a9-e91e-4d13-8672-2250c0e18b43",
  "startTime": "2021-12-30T07:50:26-05:00",
  "name": "init-test",
  "key": "INIT-TEST",
  "env": "local",
  "duration": null,
  "durationFormat": "Invalid date",
  "timestamp": "2021-12-30T07:50:26-05:00",
  "type": "testSuite",
  "total": 1,
  "success": false,
  "passed": 0,
  "failed": 1,
  "skipped": 0,
  "scenarios": {
    "passed": 0,
    "failed": 2,
    "skipped": 0,
    "undefined": 0
  },
  "features": [
    {
      "description": "",
      "elements": [
        {
          "description": "",
          "id": "get-/;successfull-hello-world",
          "keyword": "Scenario",
          "line": 3,
          "name": "Successfull hello world",
          "steps": [
            {
              "keyword": "Before",
              "hidden": true,
              "result": {
                "status": "passed",
                "duration": 0
              }
            },
            {
              "keyword": "Before",
              "hidden": true,
              "result": {
                "status": "passed",
                "duration": 0
              }
            },
            {
              "arguments": [],
              "keyword": "Given ",
              "line": 4,
              "name": "I have the api gateway hosted on \"http://localhost:3000\"",
              "match": {
                "location": "../node_modules/@restqa/restqapi/node_modules/@restqa/plugin/index.js:189"
              },
              "result": {
                "status": "passed",
                "duration": 1000000
              }
            },
            {
              "arguments": [],
              "keyword": "And ",
              "line": 5,
              "name": "I have the path \"/\"",
              "match": {
                "location": "../node_modules/@restqa/restqapi/node_modules/@restqa/plugin/index.js:189"
              },
              "result": {
                "status": "passed",
                "duration": 0
              }
            },
            {
              "arguments": [],
              "keyword": "And ",
              "line": 6,
              "name": "I have the method \"GET\"",
              "match": {
                "location": "../node_modules/@restqa/restqapi/node_modules/@restqa/plugin/index.js:189"
              },
              "result": {
                "status": "passed",
                "duration": 0
              }
            },
            {
              "arguments": [],
              "keyword": "When ",
              "line": 7,
              "name": "I run the API",
              "match": {
                "location": "../node_modules/@restqa/restqapi/node_modules/@restqa/plugin/index.js:189"
              },
              "result": {
                "status": "passed",
                "duration": 19000000
              },
              "embeddings": [
                {
                  "data": "curl -X GET --url http://localhost/",
                  "mime_type": "text/plain"
                }
              ]
            },
            {
              "arguments": [],
              "keyword": "Then ",
              "line": 8,
              "name": "I should receive a response with the status 200",
              "match": {
                "location": "../node_modules/@restqa/restqapi/node_modules/@restqa/plugin/index.js:189"
              },
              "result": {
                "status": "failed",
                "duration": 1000000,
                "error_message": "AssertionError [ERR_ASSERTION]: [GET /] The response httpCode is invalid, received 500 should be 200\n    + expected - actual\n\n    -500\n    +200\n\n    at Object.Then.httpCode (/Users/olivierodo/WORKS/restqa/restqa/node_modules/@restqa/restqapi/src/restqapi/steps/3-then/functions.js:26:10)"
              }
            },
            {
              "arguments": [
                {
                  "content": "{\n\"hello\": \"world\"\n}",
                  "line": 10
                }
              ],
              "keyword": "And ",
              "line": 9,
              "name": "the response body should be equal to:",
              "match": {
                "location": "../node_modules/@restqa/restqapi/node_modules/@restqa/plugin/index.js:189"
              },
              "result": {
                "status": "skipped",
                "duration": 0
              }
            },
            {
              "keyword": "After",
              "hidden": true,
              "result": {
                "status": "passed",
                "duration": 0
              },
              "embeddings": [
                {
                  "data": "{\"apis\":[{\"curl\":\"curl -X GET --url http://localhost/\",\"request\":{\"hostname\":\"localhost\",\"port\":\"3000\",\"protocol\":\"http:\",\"pathname\":\"/\",\"retry\":0,\"hooks\":{\"afterResponse\":[null]},\"method\":\"get\",\"headers\":{\"x-correlation-id\":\"test-e2e-get-116-1640868626187\",\"user-agent\":\"restqa (https://github.com/restqa/restqa)\"},\"responseType\":\"json\"},\"response\":{\"body\":\"<!DOCTYPE html>\\n<html lang=\\\"en\\\">\\n<head>\\n<meta charset=\\\"utf-8\\\">\\n<title>Error</title>\\n</head>\\n<body>\\n<pre>ReferenceError: re is not defined<br> &nbsp; &nbsp;at /Users/olivierodo/WORKS/restqa/restqa/tests/init-test/index.js:8:5<br> &nbsp; &nbsp;at Layer.handle [as handle_request] (/Users/olivierodo/WORKS/restqa/restqa/node_modules/express/lib/router/layer.js:95:5)<br> &nbsp; &nbsp;at next (/Users/olivierodo/WORKS/restqa/restqa/node_modules/express/lib/router/route.js:137:13)<br> &nbsp; &nbsp;at Route.dispatch (/Users/olivierodo/WORKS/restqa/restqa/node_modules/express/lib/router/route.js:112:3)<br> &nbsp; &nbsp;at Layer.handle [as handle_request] (/Users/olivierodo/WORKS/restqa/restqa/node_modules/express/lib/router/layer.js:95:5)<br> &nbsp; &nbsp;at /Users/olivierodo/WORKS/restqa/restqa/node_modules/express/lib/router/index.js:281:22<br> &nbsp; &nbsp;at Function.process_params (/Users/olivierodo/WORKS/restqa/restqa/node_modules/express/lib/router/index.js:335:12)<br> &nbsp; &nbsp;at next (/Users/olivierodo/WORKS/restqa/restqa/node_modules/express/lib/router/index.js:275:10)<br> &nbsp; &nbsp;at expressInit (/Users/olivierodo/WORKS/restqa/restqa/node_modules/express/lib/middleware/init.js:40:5)<br> &nbsp; &nbsp;at Layer.handle [as handle_request] (/Users/olivierodo/WORKS/restqa/restqa/node_modules/express/lib/router/layer.js:95:5)</pre>\\n</body>\\n</html>\\n\",\"timing\":12,\"headers\":{\"x-powered-by\":\"Express\",\"content-security-policy\":\"default-src 'none'\",\"x-content-type-options\":\"nosniff\",\"content-type\":\"text/html; charset=utf-8\",\"content-length\":\"1371\",\"date\":\"Thu, 30 Dec 2021 12:50:26 GMT\",\"connection\":\"close\"},\"statusCode\":500,\"request\":{\"path\":\"/\",\"method\":\"get\",\"prefix\":\"[GET /]\"}}}]}",
                  "mime_type": "application/json"
                }
              ]
            }
          ],
          "tags": [],
          "type": "scenario",
          "step_passed": 7,
          "step_failed": 1,
          "step_skipped": 1,
          "step_undefined": 0,
          "result": false,
          "status": "failed",
          "duration": 0.021,
          "timestamp": "2021-12-30T07:50:26-05:00",
          "metadata": {
            "id": "efb6d4a9-e91e-4d13-8672-2250c0e18b43",
            "startTime": "2021-12-30T07:50:26-05:00",
            "name": "init-test",
            "key": "INIT-TEST",
            "env": "local",
            "duration": null,
            "durationFormat": "Invalid date"
          }
        },
        {
          "description": "",
          "id": "get-/;non-successfull",
          "keyword": "Scenario",
          "line": 16,
          "name": "Non successfull",
          "steps": [
            {
              "keyword": "Before",
              "hidden": true,
              "result": {
                "status": "passed",
                "duration": 0
              }
            },
            {
              "keyword": "Before",
              "hidden": true,
              "result": {
                "status": "passed",
                "duration": 0
              }
            },
            {
              "arguments": [],
              "keyword": "Given ",
              "line": 17,
              "name": "I have the api gateway hosted on \"http://localhost:3000\"",
              "match": {
                "location": "../node_modules/@restqa/restqapi/node_modules/@restqa/plugin/index.js:189"
              },
              "result": {
                "status": "passed",
                "duration": 1000000
              }
            },
            {
              "arguments": [],
              "keyword": "And ",
              "line": 18,
              "name": "I have the path \"/\"",
              "match": {
                "location": "../node_modules/@restqa/restqapi/node_modules/@restqa/plugin/index.js:189"
              },
              "result": {
                "status": "passed",
                "duration": 0
              }
            },
            {
              "arguments": [],
              "keyword": "And ",
              "line": 19,
              "name": "I have the method \"GET\"",
              "match": {
                "location": "../node_modules/@restqa/restqapi/node_modules/@restqa/plugin/index.js:189"
              },
              "result": {
                "status": "passed",
                "duration": 0
              }
            },
            {
              "arguments": [],
              "keyword": "When ",
              "line": 20,
              "name": "I run the API",
              "match": {
                "location": "../node_modules/@restqa/restqapi/node_modules/@restqa/plugin/index.js:189"
              },
              "result": {
                "status": "passed",
                "duration": 5000000
              }
            },
            {
              "arguments": [],
              "keyword": "Then ",
              "line": 21,
              "name": "I should receive a response with the status 201",
              "match": {
                "location": "../node_modules/@restqa/restqapi/node_modules/@restqa/plugin/index.js:189"
              },
              "result": {
                "status": "failed",
                "duration": 0,
                "error_message": "AssertionError [ERR_ASSERTION]: [GET /] The response httpCode is invalid, received 500 should be 201\n    + expected - actual\n\n    -500\n    +201\n\n    at Object.Then.httpCode (/Users/olivierodo/WORKS/restqa/restqa/node_modules/@restqa/restqapi/src/restqapi/steps/3-then/functions.js:26:10)"
              }
            },
            {
              "arguments": [
                {
                  "content": "{\n\"hello\": \"world\"\n}",
                  "line": 23
                }
              ],
              "keyword": "And ",
              "line": 22,
              "name": "the response body should be equal to:",
              "match": {
                "location": "../node_modules/@restqa/restqapi/node_modules/@restqa/plugin/index.js:189"
              },
              "result": {
                "status": "skipped",
                "duration": 0
              }
            },
            {
              "keyword": "After",
              "hidden": true,
              "result": {
                "status": "passed",
                "duration": 0
              },
              "embeddings": [
                {
                  "data": "{\"apis\":[{\"curl\":\"curl -X GET --url http://localhost/\",\"request\":{\"hostname\":\"localhost\",\"port\":\"3000\",\"protocol\":\"http:\",\"pathname\":\"/\",\"retry\":0,\"hooks\":{\"afterResponse\":[null]},\"method\":\"get\",\"headers\":{\"x-correlation-id\":\"test-e2e-get-800-1640868626215\",\"user-agent\":\"restqa (https://github.com/restqa/restqa)\"},\"responseType\":\"json\"},\"response\":{\"body\":\"<!DOCTYPE html>\\n<html lang=\\\"en\\\">\\n<head>\\n<meta charset=\\\"utf-8\\\">\\n<title>Error</title>\\n</head>\\n<body>\\n<pre>ReferenceError: re is not defined<br> &nbsp; &nbsp;at /Users/olivierodo/WORKS/restqa/restqa/tests/init-test/index.js:8:5<br> &nbsp; &nbsp;at Layer.handle [as handle_request] (/Users/olivierodo/WORKS/restqa/restqa/node_modules/express/lib/router/layer.js:95:5)<br> &nbsp; &nbsp;at next (/Users/olivierodo/WORKS/restqa/restqa/node_modules/express/lib/router/route.js:137:13)<br> &nbsp; &nbsp;at Route.dispatch (/Users/olivierodo/WORKS/restqa/restqa/node_modules/express/lib/router/route.js:112:3)<br> &nbsp; &nbsp;at Layer.handle [as handle_request] (/Users/olivierodo/WORKS/restqa/restqa/node_modules/express/lib/router/layer.js:95:5)<br> &nbsp; &nbsp;at /Users/olivierodo/WORKS/restqa/restqa/node_modules/express/lib/router/index.js:281:22<br> &nbsp; &nbsp;at Function.process_params (/Users/olivierodo/WORKS/restqa/restqa/node_modules/express/lib/router/index.js:335:12)<br> &nbsp; &nbsp;at next (/Users/olivierodo/WORKS/restqa/restqa/node_modules/express/lib/router/index.js:275:10)<br> &nbsp; &nbsp;at expressInit (/Users/olivierodo/WORKS/restqa/restqa/node_modules/express/lib/middleware/init.js:40:5)<br> &nbsp; &nbsp;at Layer.handle [as handle_request] (/Users/olivierodo/WORKS/restqa/restqa/node_modules/express/lib/router/layer.js:95:5)</pre>\\n</body>\\n</html>\\n\",\"timing\":3,\"headers\":{\"x-powered-by\":\"Express\",\"content-security-policy\":\"default-src 'none'\",\"x-content-type-options\":\"nosniff\",\"content-type\":\"text/html; charset=utf-8\",\"content-length\":\"1371\",\"date\":\"Thu, 30 Dec 2021 12:50:26 GMT\",\"connection\":\"close\"},\"statusCode\":500,\"request\":{\"path\":\"/\",\"method\":\"get\",\"prefix\":\"[GET /]\"}}}]}",
                  "mime_type": "application/json"
                }
              ]
            }
          ],
          "tags": [],
          "type": "scenario",
          "step_passed": 7,
          "step_failed": 1,
          "step_skipped": 1,
          "step_undefined": 0,
          "result": false,
          "status": "failed",
          "duration": 0.006,
          "timestamp": "2021-12-30T07:50:26-05:00",
          "metadata": {
            "id": "efb6d4a9-e91e-4d13-8672-2250c0e18b43",
            "startTime": "2021-12-30T07:50:26-05:00",
            "name": "init-test",
            "key": "INIT-TEST",
            "env": "local",
            "duration": null,
            "durationFormat": "Invalid date"
          }
        }
      ],
      "id": "get-/",
      "line": 1,
      "keyword": "Feature",
      "tags": [],
      "uri": "../tests/init-test/tests/integration/welcome-restqa.feature",
      "total": 2,
      "passed": 0,
      "failed": 2,
      "skipped": 0,
      "undefined": 0,
      "result": false,
      "duration": 0.027000000000000003,
      "timestamp": "2021-12-30T07:50:26-05:00",
      "type": "feature",
      "feature_name": "GET /",
      "metadata": {
        "id": "efb6d4a9-e91e-4d13-8672-2250c0e18b43",
        "startTime": "2021-12-30T07:50:26-05:00",
        "name": "init-test",
        "key": "INIT-TEST",
        "env": "local",
        "duration": null,
        "durationFormat": "Invalid date"
      }
    }
  ]
}

//OUTPUT.RESTQA_INTEGRATION = 'test'
OUTPUT.RESTQA_COLLECTION = {
  "postman": "/Users/olivierodo/WORKS/restqa/restqa/example/tests/collections/example-restqa.postman_collection.json",
  "insomnia": null,
  "hoppscotch": null
}

const contributors = [
 {
    commits: '456',
    username: 'Olivier',
    email: 'hi@olivierodo.me',
    avatar: 'https://www.gravatar.com/avatar/6b262c3874c116f42b3a7abf26b9dc5b'
  },
  {
    commits: '175',
    username: 'tony-go',
    email: 'gorez.tony@gmail.com',
    avatar: 'https://www.gravatar.com/avatar/a7723d411779f7a8db4d4ada86a92daa'
  },
  {
    commits: '84',
    username: 'Olivier',
    email: 'rodomond.o@gmail.com',
    avatar: 'https://www.gravatar.com/avatar/390faeebd65126f39946137853336bd6'
  },
  {
    commits: '36',
    username: 'OliverOdo',
    email: 'hi@olivierodo.me',
    avatar: 'https://www.gravatar.com/avatar/6b262c3874c116f42b3a7abf26b9dc5b'
  },
  {
    commits: '23',
    username: 'dependabot[bot]',
    email: '49699333+dependabot[bot]@users.noreply.github.com',
    avatar: 'https://www.gravatar.com/avatar/48ea49be76d0c68403a7f3df87e3487d'
  },
  {
    commits: '2',
    username: 'Olivier Rodomond',
    email: 'olivierodo@Oliviers-Air.lan',
    avatar: 'https://www.gravatar.com/avatar/5f87a025a6aa06262889547f7995c991'
  },
  {
    commits: '2',
    username: 'Mason Woodford',
    email: 'mwoodfor@ucsc.edu',
    avatar: 'https://www.gravatar.com/avatar/48c53c7f87a7243c1df2418a0391c475'
  },
  {
    commits: '2',
    username: 'KaTLaz',
    email: '65902811+KaTLaz@users.noreply.github.com',
    avatar: 'https://www.gravatar.com/avatar/9b96229f443b3b44397d6ae23ec8dda5'
  },
  {
    commits: '2',
    username: 'pimpannt',
    email: 'pimpannt@gmail.com',
    avatar: 'https://www.gravatar.com/avatar/a540af6d867afaba29f28b5a7bfbc375'
  },
  {
    commits: '2',
    username: 'restqa-bot',
    email: 'null',
    avatar: 'https://www.gravatar.com/avatar/37a6259cc0c1dae299a7866489dff0bd'
  },
  {
    commits: '1',
    username: 'Tony Gorez',
    email: 'gorez.tony@gmail.com',
    avatar: 'https://www.gravatar.com/avatar/a7723d411779f7a8db4d4ada86a92daa'
  },
  {
    commits: '1',
    username: 'OliverOdo',
    email: 'rodomond.o@gmail.com',
    avatar: 'https://www.gravatar.com/avatar/390faeebd65126f39946137853336bd6'
  }
]
      
OUTPUT.RESTQA_CONTRIBUTORS = contributors

OUTPUT.RESTQA_CONFIG = {
    "version": "0.0.1",
    "metadata": {
      "code": "EXAMPLE-RESTQA",
      "name": "Example Restqa",
      "description": "Delicious Microservice example maintained with RestQA"
    },
    "tests": {
      "unit": {
        "port": 8887,
        "command": "npm run dev",
        "data": {}
      },
      performance: {
        tool: 'artillery',
        outputFolder: 'tests/performance'
      }
    },
    specification: {
      tool: 'swagger'
    }
}

OUTPUT.RESTQA_PERFORMANCE = [
 'tests/performances/get.yml',
]

OUTPUT.RESTQA_SPECIFICATION = {
    "openapi": "3.0.0",
    "info": {
      "version": "0.0.1",
      "title": "Example Restqa",
      "description": "helloe my friend"
    },
    "paths": {
      "/": {
        "get": {
          "deprecated": false,
          "operationId": "get",
          "summary": "Successfull hello world",
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "hello": {
                        "type": "string",
                        "example": "world"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
}

OUTPUT.RESTQA_HTTP_MOCKS = {
  outputFolder: '/Users/olivierodo/WORKS/restqa/restqa/example/tests/mocks',
  files: [
    '/Users/olivierodo/WORKS/restqa/restqa/example/tests/mocks/get.feature1.mock.yml',
    '/Users/olivierodo/WORKS/restqa/restqa/example/tests/mocks/get.feature2.mock.yml'
  ]
}

window.OUTPUT = OUTPUT
