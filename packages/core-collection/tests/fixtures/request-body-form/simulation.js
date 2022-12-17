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
      name: "Add FORM Request body"
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
result[0].apis[0].request.addFormField("firstname", "John");

result.push({
  scenario: {
    gherkinDocument: {
      feature: {
        name: "GET /"
      }
    },
    pickle: {
      name: "Add FORM Request body multiple values"
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

result[1].apis[0].request.setMethod("POST");
result[1].apis[0].request.addFormField("firstname", "John");
result[1].apis[0].request.addFormField("lastname", "Doe");
module.exports = result;
