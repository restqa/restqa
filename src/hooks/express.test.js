
const express = require("express")
const {EventEmitter, once} = require("events");
const got = require("got")

const expressHook = require("./express");

describe("Express hooks", () => {
  let app;
  let httpClient;
  let serverPort;

  const port = 0
  const message = "hello world";
  const options = {
    configFile: false,
    sandbox: new EventEmitter()
  };
  
  beforeAll(async() => {
    app = express().use(express.json());
    expressHook(app, options);
    app.get("/hello", (req, res) => {
      return res.json({message});
    });
    app.post("/greeting", (req, res) => {
      return res.status(201).json({message});
    });

    const server = app.listen(port);

    serverPort = server.address().port;
    httpClient = got.extend({
      prefixUrl: `http://127.0.0.1:${serverPort}`,
      throwHttpErrors: false
    });
  });

  afterAll(async() => {
    await app.close()
  })

  test("Send Event on each request that passing (GET)", async () => {
    const requestAPI = httpClient.get("hello", {responseType: "json"});
    const requestDashboard = httpClient.get("restqa");
    const promiseEvent = once(options.sandbox, "request");

    const [responseAPI, responseDashboard, emittedEvent] =
      await Promise.all([requestAPI, requestDashboard, promiseEvent]);

    expect(responseAPI.statusCode).toBe(200);
    expect(responseAPI.body.message).toBe(message);

    expect(responseDashboard.statusCode).toBe(200);
    expect(responseDashboard.headers["content-type"]).toBe(
      "text/html; charset=UTF-8"
    );
    const expectedRequest = expect.objectContaining({
      request: {
        method: "GET",
        path: "/hello",
        query: {},
        headers: {
          accept: "application/json",
          "accept-encoding": "gzip, deflate, br",
          connection: "close",
          host: "127.0.0.1:" + serverPort,
          "user-agent": "got (https://github.com/sindresorhus/got)"
        },
        body: {}
      },
      response: {
        statusCode: 200,
        headers: {
          "content-length": "25",
          "content-type": "application/json; charset=utf-8",
          "x-powered-by": "Express"
        },
        body: {
          message
        }
      }
    });
    expect(emittedEvent).toHaveLength(1);
    expect(emittedEvent[0]).toEqual(expectedRequest);
  });

  test("Send Event on each request that passing (GET + query parameters)", async () => {
    const requestAPI = httpClient.get("hello?foo=bar&first=parameter", {
      responseType: "json"
    });
    const requestDashboard = httpClient.get("restqa");
    const promiseEvent = once(options.sandbox, "request");

    const [responseAPI, responseDashboard, emittedEvent] =
      await Promise.all([requestAPI, requestDashboard, promiseEvent]);

    expect(responseAPI.statusCode).toBe(200);
    expect(responseAPI.body.message).toBe(message);

    expect(responseDashboard.statusCode).toBe(200);
    expect(responseDashboard.headers["content-type"]).toBe(
      "text/html; charset=UTF-8"
    );

    const expectedRequest = expect.objectContaining({
      request: {
        method: "GET",
        path: "/hello",
        query: {
          foo: "bar",
          first: "parameter"
        },
        body: {},
        headers: {
          accept: "application/json",
          "accept-encoding": "gzip, deflate, br",
          connection: "close",
          host: "127.0.0.1:" + serverPort,
          "user-agent": "got (https://github.com/sindresorhus/got)"
        }
      },
      response: {
        statusCode: 200,
        headers: {
          "content-length": "25",
          "content-type": "application/json; charset=utf-8",
          "x-powered-by": "Express"
        },
        body: {
          message
        }
      }
    });
    expect(emittedEvent).toHaveLength(1);
    expect(emittedEvent[0]).toEqual(expectedRequest);
  });

  test("Send Event on each request that passing (get + header parameters)", async () => {
    const requestAPI = httpClient.get("hello", {
      responseType: "json",
      headers: {
        "x-api-key": "xxx-yyy-zzz",
        "accept-type": "application/json"
      }
    });
    const requestDashboard = httpClient.get("restqa");
    const promiseEvent = once(options.sandbox, "request");

    const [responseAPI, responseDashboard, emittedEvent] =
      await Promise.all([requestAPI, requestDashboard, promiseEvent]);

    expect(responseAPI.statusCode).toBe(200);
    expect(responseAPI.body.message).toBe(message);

    expect(responseDashboard.statusCode).toBe(200);
    expect(responseDashboard.headers["content-type"]).toBe(
      "text/html; charset=UTF-8"
    );

    const expectedRequest = expect.objectContaining({
      request: {
        method: "GET",
        path: "/hello",
        headers: {
          "x-api-key": "xxx-yyy-zzz",
          accept: "application/json",
          "accept-encoding": "gzip, deflate, br",
          "accept-type": "application/json",
          "user-agent": "got (https://github.com/sindresorhus/got)",
          connection: "close",
          host: "127.0.0.1:" + serverPort
        },
        query: {},
        body: {}
      },
      response: {
        statusCode: 200,
        headers: {
          "content-length": "25",
          "content-type": "application/json; charset=utf-8",
          "x-powered-by": "Express"
        },
        body: {
          message
        }
      }
    });
    expect(emittedEvent).toHaveLength(1);
    expect(emittedEvent[0]).toEqual(expectedRequest);
  });

  test("Send Event on each request that passing (post + json body)", async () => {
    const opt = {
      ...options,
      route: "/jestqa"
    };
    const localApp = express().use(express.json());
    expressHook(localApp, opt)
    const localServer = localApp.listen(0);
    const port = localServer.address().port;

    const localHttpClient = got.extend({
      prefixUrl: `http://127.0.0.1:${port}`,
      throwHttpErrors: false
    });


    const responseDashboard = await localHttpClient.get("jestqa");

    localServer.close();

    expect(responseDashboard.statusCode).toBe(200);
    expect(responseDashboard.headers["content-type"]).toBe(
      "text/html; charset=UTF-8"
    );
  });
});