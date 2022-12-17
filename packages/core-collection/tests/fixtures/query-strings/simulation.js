const Request = require("@restqa/plugin-rest-api/src/rest-api/lib/api/request");
const Response = require("@restqa/plugin-rest-api/src/rest-api/lib/api/response");

const result = [];

result.push({
  scenario: {
    gherkinDocument: {
      feature: {
        name: "GET /"
      }
    },
    pickle: {
      name: "Single query string"
    }
  },
  apis: [
    {
      request: new Request("http://localhost:3000/status"),
      response: Response({
        statusCode: 201,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          message: "Hello World!"
        })
      })
    }
  ]
});
result[0].apis[0].request.setQueryString("match", "query");

result.push({
  scenario: {
    gherkinDocument: {
      feature: {
        name: "GET /"
      }
    },
    pickle: {
      name: "Multiple query strings"
    }
  },
  apis: [
    {
      request: new Request("http://localhost:3000/users/account"),
      response: Response({
        statusCode: 202,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          id: 1,
          firstName: "John",
          lastName: "Doe"
        })
      })
    }
  ]
});
result[1].apis[0].request.setQueryString("search", "keyword");
result[1].apis[0].request.setQueryString("page", "1");

module.exports = result;
