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
      name: "Add JSON Request body"
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

result[0].apis[0].request.setMethod("POST");
result[0].apis[0].request.setPayload({
  firtname: "John doe"
});

module.exports = result;
