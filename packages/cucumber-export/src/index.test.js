beforeEach(() => {
  jest.resetModules();
});

describe("#index - src", () => {
  test("Throw Error when the config outputs is not an array", () => {
    const Format = require("./format");
    jest.mock("./format");

    const Instance = require("./index");
    const config = {};
    const testRunResult = {};
    expect(() => {
      /* eslint-disable no-new */
      new Instance(config, testRunResult);
    }).toThrow("The config.outputs needs to be an array");
    expect(Format.mock.calls).toHaveLength(0);
  });

  test("Throw Error when the config outputs contains an invalid report type", () => {
    const Format = require("./format");
    jest.mock("./format");

    const list = require("./reports");
    const Instance = require("./index");
    const config = {
      outputs: [
        {
          type: "spaceX",
          enabled: true
        }
      ]
    };
    const testRunResult = {};
    expect(() => {
      /* eslint-disable no-new */
      new Instance(config, testRunResult);
    }).toThrow(
      `The spaceX output doesn't exist. Available: ${Object.keys(list).join(
        ", "
      )}`
    );
    expect(Format.mock.calls).toHaveLength(0);
  });

  test("No output", () => {
    const Format = require("./format");
    jest.mock("./format");

    const Instance = require("./index");
    const config = {
      outputs: []
    };
    const testRunResult = {};
    const instance = new Instance(config, testRunResult);
    const result = [];
    instance.exports(result);
    expect(Format.mock.calls).toHaveLength(0);
  });

  test("Success calls with any ouputs enabled (default config)", () => {
    const {v4: uuidv4} = require("uuid");
    jest.mock("uuid");
    uuidv4.mockReturnValue(123456);

    jest.mock("moment", () => () => ({
      format: () => "2018–01–30T12:34:56+00:00"
    }));

    const Format = require("./format");
    jest.mock("./format");
    Format.mockReturnValue({result: true});

    let Reports = require("./reports");
    jest.mock("./reports");
    Reports = {
      "elastic-search": jest.fn()
    };

    const Instance = require("./index");
    const config = {
      outputs: [
        {
          type: "elastic-search",
          enabled: false
        }
      ]
    };

    const testRunResult = {
      result: {
        duration: 2000
      }
    };

    const instance = new Instance(config, testRunResult);
    const result = [
      {
        foo: "bar"
      }
    ];

    instance.exports(result);

    expect(Format.mock.calls).toHaveLength(1);
    const expectedMetadata = {
      id: 123456,
      startTime: "2018–01–30T12:34:56+00:00",
      ...testRunResult.result
    };
    expect(Format.mock.calls[0][0]).toEqual(expectedMetadata, [{foo: "bar"}]);
    expect(Reports["elastic-search"].mock.calls).toHaveLength(0);
  });

  test("Success calls with custom exporter", async () => {
    jest.mock("moment", () => () => ({
      format: () => "2020–01–30T12:34:56+00:00"
    }));

    const Format = require("./format");
    jest.mock("./format");
    Format.mockReturnValue({result: true});

    const Instance = require("./index");
    const config = {
      uuid: 987,
      name: "my name",
      key: "my key",
      env: "my env",
      outputs: [
        {
          type: "myExporter",
          enabled: true,
          config: {
            you: "test"
          }
        }
      ],
      customExporters: {
        myExporter: function () {
          return Promise.resolve(["my custom exporter response"]);
        }
      }
    };

    const testRunResult = {
      result: {
        duration: 2000
      }
    };

    const instance = new Instance(config, testRunResult);
    const result = [
      {
        foo: "bar"
      }
    ];

    await expect(instance.exports(result)).resolves.toEqual([
      {status: "fulfilled", value: ["my custom exporter response"]}
    ]);
  });

  test("Success calls with some ouputs enabled", async () => {
    jest.mock("moment", () => () => ({
      format: () => "2020–01–30T12:34:56+00:00"
    }));

    const Format = require("./format");
    jest.mock("./format");
    Format.mockReturnValue({result: true});

    const Reports = require("./reports");
    jest.mock("./reports");
    Reports["elastic-search"] = jest.fn(() =>
      Promise.resolve(["my elk response"])
    );

    const Instance = require("./index");
    const config = {
      uuid: 987,
      name: "my name",
      key: "my key",
      env: "my env",
      outputs: [
        {
          type: "elastic-search",
          enabled: true,
          config: {
            you: "test"
          }
        }
      ]
    };

    const testRunResult = {
      result: {
        duration: 2000
      }
    };

    const instance = new Instance(config, testRunResult);
    const result = [
      {
        foo: "bar"
      }
    ];

    await expect(instance.exports(result)).resolves.toEqual([
      {status: "fulfilled", value: ["my elk response"]}
    ]);

    expect(Format.mock.calls).toHaveLength(1);

    const expectedMetadata = {
      id: 987,
      name: "my name",
      key: "my key",
      env: "my env",
      startTime: "2020–01–30T12:34:56+00:00",
      ...testRunResult.result
    };

    expect(Format.mock.calls[0][0]).toEqual(expectedMetadata, [{foo: "bar"}]);

    expect(Reports["elastic-search"].mock.calls).toHaveLength(1);
    expect(Reports["elastic-search"].mock.calls[0][0]).toEqual({you: "test"});
    expect(Reports["elastic-search"].mock.calls[0][1]).toEqual({result: true});
  });

  test("Error returns from the return", async () => {
    const Format = require("./format");
    jest.mock("./format");
    Format.mockReturnValue({result: true});

    const Reports = require("./reports");
    jest.mock("./reports");
    Reports["elastic-search"] = jest.fn(() =>
      Promise.reject(new Error("my elk Error"))
    );

    const Instance = require("./index");
    const config = {
      uuid: 987,
      startTime: "2020–01–30T12:34:56+00:00",
      outputs: [
        {
          type: "elastic-search",
          enabled: true,
          config: {
            you: "test"
          }
        }
      ]
    };

    const testRunResult = {
      result: {
        duration: 2000
      }
    };

    const instance = new Instance(config, testRunResult);
    const result = [
      {
        foo: "bar"
      }
    ];

    await expect(instance.exports(result)).resolves.toEqual([
      {status: "rejected", reason: new Error("my elk Error")}
    ]);

    expect(Format.mock.calls).toHaveLength(1);

    const expectedMetadata = {
      id: 987,
      startTime: "2020–01–30T12:34:56+00:00",
      name: undefined,
      key: undefined,
      env: undefined,
      ...testRunResult.result
    };

    expect(Format.mock.calls[0][0]).toEqual(expectedMetadata, [{foo: "bar"}]);

    expect(Reports["elastic-search"].mock.calls).toHaveLength(1);
    expect(Reports["elastic-search"].mock.calls[0][0]).toEqual({you: "test"});
    expect(Reports["elastic-search"].mock.calls[0][1]).toEqual({result: true});
  });
});
