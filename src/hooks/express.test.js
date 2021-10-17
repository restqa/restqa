
const express = require("express")
const {EventEmitter, once} = require("events");
const got = require("got")

const expressHook = require("./express");

describe("Express hooks", () => {
  test("Send Event on each request that passing (GET)", async () => {
    const message = "hello world";
    const opt = {
      configFile: false,
      sandbox: new EventEmitter()
    };

    const app = express().use(express.json());
    expressHook(app, opt);
    app.get("/hello", (req, res) => {
      return res.json({message});
    });

    const server = app.listen(0);
    const port = server.address().port;

    const instance = got.extend({
      prefixUrl: `http://127.0.0.1:${port}`,
      throwHttpErrors: false
    });

    const requestAPI = instance.get("hello", {responseType: "json"});
    const requestDashboard = instance.get("restqa");
    const promiseEvent = once(opt.sandbox, "request");

    const [responseAPI, responseDashboard, emittedEvent] =
      await Promise.all([requestAPI, requestDashboard, promiseEvent]);

    server.close();

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
          host: "127.0.0.1:" + port,
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
    const message = "hello world";
    const opt = {
      configFile: false,
      sandbox: new EventEmitter()
    };

    const app = express().use(express.json());
    expressHook(app, opt);
    app.get("/hello", (req, res) => {
      return res.json({message});
    });

    const server = app.listen(0);
    const port = server.address().port;

    const instance = got.extend({
      prefixUrl: `http://127.0.0.1:${port}`,
      throwHttpErrors: false
    });

    const requestAPI = instance.get("hello?foo=bar&first=parameter", {
      responseType: "json"
    });
    const requestDashboard = instance.get("restqa");
    const promiseEvent = once(opt.sandbox, "request");

    const [responseAPI, responseDashboard, emittedEvent] =
      await Promise.all([requestAPI, requestDashboard, promiseEvent]);

    server.close();

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
          host: "127.0.0.1:" + port,
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
    const message = "hello world";
    const opt = {
      configFile: false,
      sandbox: new EventEmitter()
    };
    const app = express().use(express.json());
   expressHook(app, opt);
    app.get("/hello", (req, res) => {
      return res.json({message});
    });

    const server = app.listen(0);
    const port = server.address().port;

    const instance = got.extend({
      prefixUrl: `http://127.0.0.1:${port}`,
      throwHttpErrors: false
    });

    const requestAPI = instance.get("hello", {
      responseType: "json",
      headers: {
        "x-api-key": "xxx-yyy-zzz",
        "accept-type": "applicaiton/json"
      }
    });
    const requestDashboard = instance.get("restqa");
    const promiseEvent = once(opt.sandbox, "request");

    const [responseAPI, responseDashboard, emittedEvent] =
      await Promise.all([requestAPI, requestDashboard, promiseEvent]);

    server.close();

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
          "accept-type": "applicaiton/json",
          "user-agent": "got (https://github.com/sindresorhus/got)",
          connection: "close",
          host: "127.0.0.1:" + port
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
    const message = "hello world";
    const opt = {
      configFile: false,
      sandbox: new EventEmitter(),
      route: "/jestqa"
    };

    const app = express().use(express.json());
    expressHook(app, opt).post("/greeting", (req, res) => {
      return res.status(201).json({message});
    });

    const server = app.listen(0);
    const port = server.address().port;

    const instance = got.extend({
      prefixUrl: `http://127.0.0.1:${port}`,
      throwHttpErrors: false
    });

    const requestAPI = instance.post("greeting", {
      json: {
        firstName: "John",
        lastName: "Doe"
      },
      responseType: "json"
    });

    const requestDashboard = instance.get("jestqa");
    const promiseEvent = once(opt.sandbox, "request");

    const [responseAPI, responseDashboard, emittedEvent] =
      await Promise.all([requestAPI, requestDashboard, promiseEvent]);

    server.close();

    expect(responseAPI.statusCode).toBe(201);
    expect(responseAPI.body.message).toBe(message);

    expect(responseDashboard.statusCode).toBe(200);
    expect(responseDashboard.headers["content-type"]).toBe(
      "text/html; charset=UTF-8"
    );

    const expectedMessage = expect.objectContaining({
      request: {
        method: "POST",
        path: "/greeting",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
          "accept-encoding": "gzip, deflate, br",
          connection: "close",
          "content-length": "37",
          host: "127.0.0.1:" + port,
          "user-agent": "got (https://github.com/sindresorhus/got)"
        },
        query: {},
        body: {
          firstName: "John",
          lastName: "Doe"
        }
      },
      response: {
        statusCode: 201,
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
    expect(emittedEvent[0]).toEqual(expectedMessage);
  });
});