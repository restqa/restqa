beforeEach(() => {
  jest.resetModules();
});

describe("#report - WEBHOOK", () => {
  test("Rejected if the config doesn't contain the url", () => {
    const Webhook = require("./webhook");
    const config = {};
    const result = {};
    return expect(Webhook(config, result)).rejects.toThrow(
      new Error('config.url is required for the "webhook" report')
    );
  });

  test("Rejected if the request fail", async () => {
    const Errors = require("../errors");
    const got = require("got");
    jest.mock("got");
    const gotError = new Error("got Msg");
    gotError.response = {
      statusCode: 503,
      body: {
        err: "foo/bar"
      }
    };

    got.mockRejectedValue(gotError);

    const Webhook = require("./webhook");
    const config = {
      url: "http://my-url.test/report"
    };

    const result = {
      success: true
    };
    await expect(Webhook(config, result)).rejects.toThrow(
      new Errors.HTTP("WEBHOOK REPORT", gotError)
    );
    const expectedOptions = {
      hostname: "my-url.test",
      port: "",
      protocol: "http:",
      pathname: "/report",
      method: "POST",
      headers: {},
      json: {
        success: true
      }
    };
    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(expectedOptions);
  });

  test("Success Case with headers", async () => {
    const got = require("got");
    jest.mock("got");
    got.mockResolvedValue({
      statusCode: 201,
      body: {
        err: "foo/bar"
      }
    });

    const Webhook = require("./webhook");
    const config = {
      url: "http://my-url.test/report",
      method: "PUT",
      headers: {
        "x-foo": "bar"
      }
    };

    const result = {
      success: true
    };
    await expect(Webhook(config, result)).resolves.toBe(
      "[WEBHOOK REPORT][201] - http://my-url.test/report"
    );

    const expectedOptions = {
      hostname: "my-url.test",
      port: "",
      protocol: "http:",
      pathname: "/report",
      method: "PUT",
      headers: {
        "x-foo": "bar"
      },
      json: {
        success: true
      }
    };
    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(expectedOptions);
  });
});
