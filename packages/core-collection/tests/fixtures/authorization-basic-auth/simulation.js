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
      name: "Add Basic Authorization"
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
result[0].apis[0].request.setHeader("Authorization", "Basic xxx-yyy-zzz");

result.push({
  scenario: {
    gherkinDocument: {
      feature: {
        name: "GET /"
      }
    },
    pickle: {
      name: "Add Basic Authorization on list of existing headers"
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
result[1].apis[0].request.setMethod("POST");
result[1].apis[0].request.setHeader("x-customer-value", "clear-cache");
result[1].apis[0].request.setHeader("Authorization", "Basic xxx-yyy-zzz");

module.exports = result;
