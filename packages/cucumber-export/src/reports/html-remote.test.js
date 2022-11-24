beforeEach(() => {
  jest.resetModules();
});

describe("#report - HTML REMOTE", () => {
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

    const HtmlRemote = require("./html-remote");
    const config = {
      url: "http://my-url.test/report"
    };

    const result = {
      success: true
    };
    await expect(HtmlRemote(config, result)).rejects.toThrow(
      new Errors.HTTP("HTML REMOTE", gotError)
    );
    const expectedOptions = {
      hostname: "my-url.test",
      port: "",
      protocol: "http:",
      pathname: "/report",
      method: "POST",
      json: {
        success: true
      }
    };
    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(expectedOptions);
  });

  test("Success Case with specific url", async () => {
    const got = require("got");
    jest.mock("got");
    got.mockResolvedValue({
      statusCode: 201
    });

    const HttpHtmlReport = require("./html-remote");
    const config = {
      url: "http://my-url.test/report"
    };

    const result = {
      id: "qqq-www-eee",
      success: true
    };
    await expect(HttpHtmlReport(config, result)).resolves.toBe(
      "[HTML REMOTE][201] - Access to your test report : http://my-url.test/report/qqq-www-eee"
    );

    const expectedOptions = {
      hostname: "my-url.test",
      port: "",
      protocol: "http:",
      pathname: "/report",
      method: "POST",
      json: {
        id: "qqq-www-eee",
        success: true
      }
    };
    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(expectedOptions);
  });

  test("Success Case with basic auth", async () => {
    const got = require("got");
    jest.mock("got");
    got.mockResolvedValue({
      statusCode: 201
    });

    const HtmlRemote = require("./html-remote");
    const config = {
      url: "http://my-url.test/report",
      auth: {
        username: "admin",
        password: "test"
      }
    };

    const result = {
      id: "qqq-www-eee",
      success: true
    };
    await expect(HtmlRemote(config, result)).resolves.toBe(
      "[HTML REMOTE][201] - Access to your test report : http://my-url.test/report/qqq-www-eee"
    );

    const expectedOptions = {
      hostname: "my-url.test",
      port: "",
      protocol: "http:",
      pathname: "/report",
      method: "POST",
      json: {
        id: "qqq-www-eee",
        success: true
      },
      headers: {
        authorization: `Basic ${Buffer.from("admin:test").toString("base64")}`
      }
    };
    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(expectedOptions);
  });

  test("Success Case using default html report from restqa", async () => {
    const got = require("got");
    jest.mock("got");
    got.mockResolvedValue({
      statusCode: 201
    });

    const HtmlRemote = require("./html-remote");
    const config = {};

    const result = {
      id: "qqq-www-eee",
      success: true
    };
    await expect(HtmlRemote(config, result)).resolves.toBe(
      "[HTML REMOTE][201] - Access to your test report : https://dashboard.restqa.io/reports/qqq-www-eee (This link will expire in 5 minutes)"
    );

    const expectedOptions = {
      hostname: "dashboard.restqa.io",
      port: "",
      protocol: "https:",
      pathname: "/reports",
      method: "POST",
      json: {
        id: "qqq-www-eee",
        success: true
      }
    };
    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(expectedOptions);
  });
});
