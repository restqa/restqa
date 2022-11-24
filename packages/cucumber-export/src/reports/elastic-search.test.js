beforeEach(() => {
  jest.resetModules();
});

describe("#Channel - Elastic-search", () => {
  const moment = require("moment");
  const currentDate = moment().format("YYYYMMDD");

  test("Rejected if the config doesn't contain the url", () => {
    const Es = require("./elastic-search");
    const config = {};
    const result = {};
    return expect(Es(config, result)).rejects.toThrow(
      new Error('config.url is required for the "elastic-search" report')
    );
  });

  test("Rejected if call fails", async () => {
    const got = require("got");
    const Errors = require("../errors");
    jest.mock("got");
    const gotError = new Error("got Msg");
    gotError.response = {
      statusCode: 503,
      body: {
        err: "foo/bar"
      }
    };
    got.mockRejectedValue(gotError);

    const Es = require("./elastic-search");
    const config = {
      url: "http://my-elk.test",
      index: "my-index"
    };

    const result = {
      features: [
        {
          fea: "foo",
          elements: [
            {
              el: "bar"
            }
          ]
        }
      ]
    };

    const {features} = result;

    await expect(Es(config, result)).rejects.toThrow(
      new Errors.HTTP("ELASTIC-SEARCH REPORT", gotError)
    );

    expect(result.features).toBeUndefined();

    expect(got.mock.calls).toHaveLength(3);

    const index = `my-index-${currentDate}`;
    let expectOptions = {
      hostname: "my-elk.test",
      port: "",
      protocol: "http:",
      pathname: `/${index}/_doc`,
      method: "POST",
      responseType: "json",
      json: result
    };
    expect(got.mock.calls[0][0]).toEqual(expectOptions);

    expectOptions = {
      hostname: "my-elk.test",
      port: "",
      protocol: "http:",
      pathname: `/${index}/_doc`,
      method: "POST",
      responseType: "json",
      json: features[0]
    };
    expect(got.mock.calls[1][0]).toEqual(expectOptions);

    expectOptions = {
      hostname: "my-elk.test",
      port: "",
      protocol: "http:",
      pathname: `/${index}/_doc`,
      method: "POST",
      responseType: "json",
      json: features[0].elements[0]
    };
    expect(got.mock.calls[2][0]).toEqual(expectOptions);
  });

  test("Rejected if another error occured", async () => {
    const got = require("got");
    jest.mock("got");
    const err = new Error("my error");
    err.code = "ERR";
    got.mockRejectedValue(err);

    const Es = require("./elastic-search");
    const config = {
      url: "http://my-elk.test",
      index: "my-index"
    };

    const result = {
      features: [
        {
          fea: "foo",
          elements: [
            {
              el: "bar"
            }
          ]
        }
      ]
    };

    await expect(Es(config, result)).rejects.toThrow(err);
    expect(result.features).toBeUndefined();
    expect(got.mock.calls).toHaveLength(3);
  });

  test("Resolved if call succeed", async () => {
    const got = require("got");
    jest.mock("got");
    got.mockResolvedValue({
      statusCode: 201,
      body: {
        foo: "bar"
      }
    });
    const Es = require("./elastic-search");
    const config = {
      url: "http://my-elk.test"
    };

    const result = {
      features: [
        {
          fea: "foo",
          elements: [
            {
              el: "bar"
            }
          ]
        }
      ]
    };

    const {features} = result;

    const index = `restqa-e2e-result-${currentDate}`;
    const expectedResult = `[ELASTIC-SEARCH REPORT] - http://my-elk.test - index : ${index}`;

    await expect(Es(config, result)).resolves.toEqual(expectedResult);
    expect(result.features).toBeUndefined();

    expect(got.mock.calls).toHaveLength(3);

    let expectOptions = {
      hostname: "my-elk.test",
      port: "",
      protocol: "http:",
      pathname: `/${index}/_doc`,
      method: "POST",
      responseType: "json",
      json: result
    };
    expect(got.mock.calls[0][0]).toEqual(expectOptions);

    expectOptions = {
      hostname: "my-elk.test",
      port: "",
      protocol: "http:",
      pathname: `/${index}/_doc`,
      method: "POST",
      responseType: "json",
      json: features[0]
    };
    expect(got.mock.calls[1][0]).toEqual(expectOptions);

    expectOptions = {
      hostname: "my-elk.test",
      port: "",
      protocol: "http:",
      pathname: `/${index}/_doc`,
      method: "POST",
      responseType: "json",
      json: features[0].elements[0]
    };
    expect(got.mock.calls[2][0]).toEqual(expectOptions);
  });
});
