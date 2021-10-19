const { EventEmitter, once } = require("events");
const fastify = require("fastify");
const got = require("got");

const restQAPlugin = require("./fastify");

describe("Fastify hooks", () => {
  let app;

  const port = 0
  const message = "hello world";
  const options = {
    configFile: false,
    sandbox: new EventEmitter()
  };
  
  beforeAll(async() => {
    app = fastify()
    app.register(restQAPlugin, options);
    app.get("/hello", () => {
      return {message};
    });
  });

  afterAll(async() => {
    await app.close()
  })

  
  test("Send Event on each request that passing (GET)", async () => {
    // Given
    await app.listen(port)
    const serverPort = app.server.address().port;

    const instance = got.extend({
      prefixUrl: `http://127.0.0.1:${serverPort}`,
      throwHttpErrors: false
    });

    const requestAPI = instance.get("hello", {responseType: "json"});
    const promiseEvent = once(options.sandbox, "request");

    // When
    const [responseAPI, emittedEvent] =
      await Promise.all([requestAPI, promiseEvent]);

    // Then
    expect(responseAPI.statusCode).toBe(200);
    expect(responseAPI.body.message).toBe(message);

    expect(emittedEvent).toHaveLength(1);
    const expectedRequest = expect.objectContaining({
      method: "GET",
      path: "/hello",
      query: {},
      headers: {
        accept: "application/json",
        "accept-encoding": "gzip, deflate, br",
        connection: "close",
        host: `127.0.0.1:${serverPort}`,
        "user-agent": "got (https://github.com/sindresorhus/got)"
      },
      body: null
    });
    const expectedResponse = {
      statusCode: 200,
      headers: {
        "content-length": "25",
        "content-type": "application/json; charset=utf-8",
      },
      body: {
        message
      }
    };
    const [event] = emittedEvent;
    expect(event.request).toEqual(expectedRequest);
    expect(event.response).toEqual(expectedResponse);
  });
});