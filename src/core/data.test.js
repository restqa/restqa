const Data = require("./data");

describe("# Data", () => {
  test("instanciate the data with default options", () => {
    const options = {};
    const data = new Data(options);
    const expectedOptions = {
      startSymbol: "{{",
      endSymbol: "}}"
    };
    expect(data.options).toEqual(expectedOptions);
  });

  test("instanciate the data with default options (null)", () => {
    const data = new Data();
    const expectedOptions = {
      startSymbol: "{{",
      endSymbol: "}}"
    };
    expect(data.options).toEqual(expectedOptions);
  });

  test("instanciate the data using a different symbols", () => {
    const options = {
      startSymbol: "{[",
      endSymbol: "]}"
    };
    const data = new Data(options);
    const expectedOptions = {
      startSymbol: "{[",
      endSymbol: "]}"
    };
    expect(data.options).toEqual(expectedOptions);
  });

  test("Throw an error when trying to instanciate if the startSymbole is that more than characters", () => {
    expect(() => {
      const options = {
        startSymbol: "{[[",
        endSymbol: "]}"
      };
      // eslint-disable-next-line
      const data = new Data(options);
    }).toThrow("The startSymbol should contains 2 charaters");

    expect(() => {
      const options = {
        startSymbol: "[",
        endSymbol: "]}"
      };
      // eslint-disable-next-line
      const data = new Data(options);
    }).toThrow("The startSymbol should contains 2 charaters");
  });

  test("Throw an error when trying to instanciate if the endSymbole is that more than characters", () => {
    expect(() => {
      const options = {
        startSymbol: "{[",
        endSymbol: "]}}"
      };
      // eslint-disable-next-line
      const data = new Data(options);
    }).toThrow("The endSymbol should contains 2 charaters");

    expect(() => {
      const options = {
        startSymbol: "{[",
        endSymbol: "]"
      };
      // eslint-disable-next-line
      const data = new Data(options);
    }).toThrow("The endSymbol should contains 2 charaters");
  });

  test("add/get values to the datastore (string)", () => {
    const options = {};
    const data = new Data(options);
    data.set("foo", "bar");
    expect(data.get("foo")).toEqual("foo");
    expect(data.get("{{foo")).toEqual("{{foo");
    expect(data.get("{{ foo}}")).toEqual("bar");
    expect(data.get("{{ foo }}")).toEqual("bar");
    expect(data.get("{{foo }}")).toEqual("bar");
    expect(data.get("{{foo}}")).toEqual("bar");
    expect(data.get("{{foo o }}")).toEqual("{{foo o }}");
  });

  test("add/get values to the datastore (integer)", () => {
    const options = {};
    const data = new Data(options);
    data.set("foo", 2021);
    expect(data.get("foo")).toEqual("foo");
    expect(data.get("{{foo")).toEqual("{{foo");
    expect(data.get("{{ foo}}")).toEqual(2021);
    expect(data.get("{{ foo }}")).toEqual(2021);
    expect(data.get("{{foo }}")).toEqual(2021);
    expect(data.get("{{foo}}")).toEqual(2021);
    expect(data.get("{{foo}} year")).toEqual("2021 year");
    expect(data.get("{{foo o }} Nice")).toEqual("{{foo o }} Nice");
  });

  test("Do not parse the data from the scenario since the there is no channel associated", () => {
    const provider = {
      get: jest.fn()
    };
    const data = new Data(null, provider);
    const scenario = `
      Hello {{ user.2.name }}
    `;
    data.parse(scenario);
    expect(provider.get).not.toHaveBeenCalled();
  });

  test("Parse all the data from the scenario to get the data from the provider (same dataset)", async () => {
    const provider = {
      get: jest.fn().mockResolvedValue({
        firstName: "john",
        lastName: "doe"
      })
    };

    const data = new Data({channel: "csv"}, provider);
    const scenario = `
      Hello {{ user.2.firstName }} {{ user.2.lastName }}
      We love to work with {{user.2.firstName}}
    `;
    await data.parse({scenario});
    expect(provider.get).toHaveBeenCalledTimes(1);
    expect(provider.get.mock.calls[0]).toEqual(["user", "2"]);
    expect(data.get("{{ user.2.firstName }}")).toEqual("john");
    expect(data.get("{{ user.2.lastName }}")).toEqual("doe");
  });

  test("Parse all the data from the scenario to get the data from the provider (different dataset)", async () => {
    const provider = {
      get: jest
        .fn()
        .mockResolvedValueOnce({
          firstName: "john",
          lastName: "doe"
        })
        .mockResolvedValue({
          firstName: "Vladimir",
          lastName: "Putin"
        })
    };

    const data = new Data({channel: "csv"}, provider);
    const scenario = `
      Hello {{ user.2.firstName }} {{ user.2.lastName }}
      We love to work with {{user.2.firstName}}
      Signed {{ president.5.firstName }} {{ president.5.lastName }}
    `;
    await data.parse({scenario});
    expect(provider.get).toHaveBeenCalledTimes(2);
    expect(provider.get.mock.calls[0]).toEqual(["user", "2"]);
    expect(data.get("{{ user.2.firstName }}")).toEqual("john");
    expect(data.get("{{ user.2.lastName }}")).toEqual("doe");
    expect(provider.get.mock.calls[1]).toEqual(["president", "5"]);
    expect(data.get("{{ president.5.firstName }}")).toEqual("Vladimir");
    expect(data.get("{{ president.5.lastName }}")).toEqual("Putin");
  });

  test("getFile", () => {
    const provider = {
      storage: {
        get: jest.fn().mockReturnValue("file")
      }
    };

    const data = new Data({channel: "csv"}, provider);
    expect(data.getFile("test.txt")).toEqual("file");
  });

  test("add data processor", async () => {
    const provider = {
      get: jest.fn().mockResolvedValue({
        firstName: "john",
        lastName: "doe"
      })
    };

    const scenario = `
      Hello {{ faker.firstName }} {{ user.1.lastName }}
    `;

    const data = new Data({channel: "csv"}, provider);
    const processor = jest.fn().mockReturnValue("Homer Simpson");
    data.addProcessor("faker", processor);
    await data.parse({scenario});
    expect(data.get("{{ faker.firstName }}")).toEqual("Homer Simpson");
    expect(data.get("{{ user.1.lastName }}")).toEqual("doe");

    expect(processor).toHaveBeenCalledTimes(1);
    expect(processor.mock.calls[0][0]).toBe("firstName");
  });

  test("add data processor but one of the value from the processor is undefined", async () => {
    const provider = {
      get: jest.fn().mockResolvedValue({
        firstName: "john",
        lastName: "doe"
      })
    };

    const scenario = `
      Hello {{ faker.firstName }} {{ user.1.lastName }}
    `;

    const data = new Data({channel: "csv"}, provider);
    const processor = jest.fn().mockReturnValueOnce("Homer Simpson");
    data.addProcessor("faker", processor);
    await data.parse({scenario});
    expect(data.get("{{ faker.firstName }}")).toEqual("Homer Simpson");
    expect(data.get("{{ faker.lastName }}")).toEqual("{{ faker.lastName }}");

    expect(processor).toHaveBeenCalledTimes(2);
    expect(processor.mock.calls[0][0]).toBe("firstName");
    expect(processor.mock.calls[1][0]).toBe("lastName");
  });
});
