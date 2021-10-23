const {EventEmitter, once} = require("events");
const fastify = require("fastify");
const got = require("got");

const restQAPlugin = require("./fastify");

describe("Fastify hooks", () => {
  let app;
  let httpClient;
  let serverPort;

  const port = 0;
  const message = "hello world";
  const options = {
    configFile: false,
    sandbox: new EventEmitter()
  };

  beforeAll(async () => {
    app = fastify();
    app.register(restQAPlugin, options);
    app.get("/hello", () => {
      return {message};
    });
    app.post("/greeting", async () => {
      return {message};
    });

    await app.listen(port);

    serverPort = app.server.address().port;
    httpClient = got.extend({
      prefixUrl: `http://127.0.0.1:${serverPort}`,
      throwHttpErrors: false
    });
  });

  afterAll(async () => {
    await app.close();
  });

  test("Given a server with a plugin When send a request Then it should be catch", async () => {
    // Given
    const requestAPI = httpClient.get("hello", {responseType: "json"});
    const watcher = once(options.sandbox, "request");

    // When
    const [responseAPI, watchedEvents] = await Promise.all([
      requestAPI,
      watcher
    ]);

    // Then
    expect(responseAPI.statusCode).toBe(200);
    expect(responseAPI.body.message).toBe(message);

    expect(watchedEvents).toHaveLength(1);
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
        "content-type": "application/json; charset=utf-8"
      },
      body: {
        message
      }
    };
    const [event] = watchedEvents;
    expect(event.request).toEqual(expectedRequest);
    expect(event.response).toEqual(expectedResponse);
  });

  test("Given a server with the plugin When send the request on /restqa Then server should respond dashboard", async () => {
    // Given
    const serverPort = app.server.address().port;
    const instance = got.extend({
      prefixUrl: `http://127.0.0.1:${serverPort}`,
      throwHttpErrors: false
    });

    // When
    const responseAPI = await instance.get("restqa");

    // Then
    expect(responseAPI.statusCode).toBe(200);
    expect(responseAPI.headers).toEqual(
      expect.objectContaining({
        "content-type": "text/html; charset=UTF-8"
      })
    );
  });

  test("Given a server with a plugin When send a request Then query params should be catch", async () => {
    // Given
    const requestAPI = httpClient.get("hello?foo=bar&first=parameter", {
      responseType: "json"
    });
    const watcher = once(options.sandbox, "request");

    // When
    const [, watchedEvents] = await Promise.all([requestAPI, watcher]);

    // Then
    const [event] = watchedEvents;
    expect(event.request.query).toEqual({
      foo: "bar",
      first: "parameter"
    });
  });

  test("Given a server with a plugin When send a request Then header params should be catch", async () => {
    // Given
    const serverPort = app.server.address().port;
    const instance = got.extend({
      prefixUrl: `http://127.0.0.1:${serverPort}`,
      throwHttpErrors: false
    });
    const headers = {
      "x-api-key": "xxx-yyy-zzz",
      "accept-type": "application/json"
    };

    const requestAPI = instance.get("hello", {
      responseType: "json",
      headers
    });
    const watcher = once(options.sandbox, "request");

    // When
    const [, watchedEvents] = await Promise.all([requestAPI, watcher]);

    // Then
    const [event] = watchedEvents;
    expect(event.request.headers).toEqual(expect.objectContaining(headers));
  });

  test("Given a server with a plugin When send a request Then body params should be catch", async () => {
    // Given
    const body = {
      name: "John",
      lastName: "Doe"
    };
    const requestAPI = httpClient.post("greeting", {
      responseType: "json",
      json: body
    });
    const watcher = once(options.sandbox, "request");

    // When
    const [, watchedEvents] = await Promise.all([requestAPI, watcher]);

    // Then
    const [event] = watchedEvents;
    expect(event.request.body).toEqual(body);
  });

  it("Given a server with a plugin and a custom route When start server Then dashboard is exposed on custom route", async () => {
    // Given
    const optionsWithCustomPath = {
      ...options,
      route: "/test-dashboard"
    };
    const localApp = fastify();
    localApp.register(restQAPlugin, optionsWithCustomPath);

    // When
    await localApp.listen(0);

    const localPort = localApp.server.address().port;
    const localHttpClient = got.extend({
      prefixUrl: `http://127.0.0.1:${localPort}`,
      throwHttpErrors: false
    });

    // Then
    const responseAPI = await localHttpClient.get("test-dashboard");
    expect(responseAPI.statusCode).toBe(200);
    expect(responseAPI.headers).toEqual(
      expect.objectContaining({
        "content-type": "text/html; charset=UTF-8"
      })
    );

    await localApp.close();
  });
});
