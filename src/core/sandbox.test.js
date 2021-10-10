const Sandbox = require("./sandbox");

afterEach(() => {
  jest.useRealTimers();
});

describe("Core - Sandbox", () => {
  test("Error when Generating scenario and emit request", () => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date("2012-10-10"));
    return new Promise((resolve) => {
      const transaction = {
        foo: "bar"
      };
      const instance = new Sandbox();
      instance.on("generated", (data) => {
        const expectedData = {
          transaction,
          status: "PENDING",
          scenario: "An error occured while generating the test: Please specify your url",
          createdAt: new Date("2012-10-10")
        };
        expect(data).toEqual(expectedData);
        resolve();
      });
      instance.emit("request", transaction);
    });
  });

  test("Generate scenario and emit request", () => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date("2012-10-10"));
    return new Promise((resolve) => {
      const transaction = {
        request: {
          method: 'GET',
          path: '/test',
          query: {}
        },
        response: {
          statusCode: 200,
          headers: {
            'x-request-id': '123456789'
          },
          body: {
            foo: 'barz'
          }
        }
      };
      const instance = new Sandbox();
      instance.on("generated", (data) => {
        const scenario = `
Given I have the api gateway
  And I have the path "/test"
  And I have the method "GET"
When I run the API
Then I should receive a response with the status 200
  And the response body should be equal to:
  """
{
  "foo": "barz"
}
  """
`.trim()
        const expectedData = {
          transaction,
          status: "PENDING",
          scenario,
          createdAt: new Date("2012-10-10")
        };
        expect(data).toEqual(expectedData);
        resolve();
      });
      instance.emit("request", transaction);
    });
  });
});
