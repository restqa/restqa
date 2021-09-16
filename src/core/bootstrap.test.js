const Plugin = require("@restqa/plugin");

const jestqa = new JestQA(__filename, true);

beforeEach(jestqa.beforeEach);
afterEach(jestqa.afterEach);

describe("#bootstrap", () => {
  test("Throw error if the processor is undefined", () => {
    const Bootstrap = require("./bootstrap");
    expect(() => {
      Bootstrap();
    }).toThrow(
      new Error(
        "Please provide a processor containing the methods: After, AfterAll, Before, BeforeAll, Given, When, Then, defineParameterType, setWorldConstructor and setDefaultTimeout."
      )
    );
  });

  test("Throw error if the processor doesn't contain an required method", () => {
    const Bootstrap = require("./bootstrap");
    expect(() => {
      Bootstrap({
        After: jest.fn()
      });
    }).toThrow(
      new Error(
        "Please provide a processor containing the methods: After, AfterAll, Before, BeforeAll, Given, When, Then, defineParameterType, setWorldConstructor and setDefaultTimeout."
      )
    );

    expect(() => {
      Bootstrap({
        After: jest.fn(),
        AfterAll: jest.fn(),
        Before: jest.fn(),
        BeforeAll: jest.fn(),
        Given: jest.fn(),
        When: jest.fn(),
        Then: jest.fn(),
        defineParameterType: jest.fn()
      });
    }).toThrow(
      new Error(
        "Please provide a processor containing the methods: After, AfterAll, Before, BeforeAll, Given, When, Then, defineParameterType, setWorldConstructor and setDefaultTimeout."
      )
    );
  });

  test("Throw error if the config can't be loaded", () => {
    const Bootstrap = require("./bootstrap");
    expect(() => {
      Bootstrap({
        After: jest.fn(),
        AfterAll: jest.fn(),
        Before: jest.fn(),
        BeforeAll: jest.fn(),
        Given: jest.fn(),
        When: jest.fn(),
        Then: jest.fn(),
        defineParameterType: jest.fn(),
        setWorldConstructor: jest.fn(),
        setDefaultTimeout: jest.fn()
      });
    }).toThrow(new Error("THE RESTQA CONFIG FILE IS MISSING (undefined)"));
  });

  test("Load plugin @restqa/restqapi then run setup the processor", () => {
    const content = `
---
version: 0.0.1
metadata:
  code: APP
  name: app
  description: Configuration generated by restqa init
environments:
  - name: local
    default: true
    secrets:
      foo: bar
    plugins:
      - name: '@restqa/restqapi'
        config:
          url: https://api.restqa.io
    outputs:
      - type: html
        enabled: true
    `;
    const filename = jestqa.createTmpFile(content, ".restqa-example.yml");

    const mockPlugin = new Plugin("restqapi");
    mockPlugin.addGivenStep("my step", () => {});
    mockPlugin.addState("host", "https://example.com");
    jest.mock("@restqa/restqapi", () => mockPlugin);

    const processor = {
      After: jest.fn(),
      AfterAll: jest.fn(),
      Before: jest.fn(),
      BeforeAll: jest.fn(),
      Given: jest.fn(),
      When: jest.fn(),
      Then: jest.fn(),
      defineParameterType: jest.fn(),
      setWorldConstructor: jest.fn(),
      setDefaultTimeout: jest.fn()
    };
    const options = {
      configFile: filename
    };

    const Bootstrap = require("./bootstrap");

    Bootstrap(processor, options);

    expect(mockPlugin.getConfig()).toEqual({
      url: "https://api.restqa.io"
    });

    expect(processor.Given).toHaveBeenCalledTimes(1);
    expect(processor.Given.mock.calls[0][0]).toEqual("my step");

    expect(processor.defineParameterType).toHaveBeenCalledTimes(1);

    expect(processor.setWorldConstructor).toHaveBeenCalledTimes(1);
    const World = processor.setWorldConstructor.mock.calls[0][0];
    const world = new World({});
    expect(world.getState("host")).toBe("https://example.com");
    expect(world.data.get("{{ foo }}")).toBe("bar");

    const {regexp, transformer, name} =
      processor.defineParameterType.mock.calls[0][0];
    expect(regexp).toEqual(/\{\{(.*)\}\}/);
    expect(name).toEqual("data");
    expect(transformer.call(world, "foo")).toEqual("bar");

    expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(1);
    expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch(
      '🎯 The selected environment is: "local"'
    );
  });

  test("Load plugin restqapi and restqkube then run setup the processor (+ setup the timeout)", () => {
    const content = `
---
version: 0.0.1
metadata:
  code: APP
  name: app
  description: Configuration generated by restqa init
environments:
  - name: local
    default: true
    data:
      startSymbol: '[['
      endSymbol: ']]'
    secrets:
      foo: bar
    plugins:
      - name: restqapi
        config:
          url: https://api.restqa.io
      - name: restqkube
        config:
          kube:
            config: ./kubeconfig
    outputs:
      - type: html
        enabled: true
restqa:
  timeout: 10000
    `;
    const filename = jestqa.createTmpFile(content, ".restqa-example.yml");

    const mockPlugins = [
      new Plugin("restqapi")
        .addGivenStep("my given step", () => {})
        .addState("host", "https://example.com"),
      new Plugin("reskube")
        .addThenStep("my then step", () => {})
        .addState("cluster", "example.cluster.local")
    ];

    jest.mock("@restqa/restqapi", () => mockPlugins[0]);

    jest.mock("module", () => {
      return {
        createRequire: () => {
          return function (config) {
            return mockPlugins[1];
          };
        }
      };
    });

    const processor = {
      After: jest.fn(),
      AfterAll: jest.fn(),
      Before: jest.fn(),
      BeforeAll: jest.fn(),
      Given: jest.fn(),
      When: jest.fn(),
      Then: jest.fn(),
      defineParameterType: jest.fn(),
      setWorldConstructor: jest.fn(),
      setDefaultTimeout: jest.fn()
    };

    const options = {
      configFile: filename
    };

    const Bootstrap = require("./bootstrap");

    Bootstrap(processor, options);

    expect(processor.Before).toHaveBeenCalledTimes(2);
    expect(processor.Before.mock.calls[0][0]).toEqual({tags: "@skip or @wip"});
    expect(processor.Before.mock.calls[0][1]).toEqual(expect.any(Function));
    expect(processor.Before.mock.calls[1][0]).toEqual(expect.any(Function));

    expect(mockPlugins[0].getConfig()).toEqual({
      url: "https://api.restqa.io"
    });

    expect(processor.Given).toHaveBeenCalledTimes(1);
    expect(processor.Given.mock.calls[0][0]).toEqual("my given step");

    expect(mockPlugins[1].getConfig()).toEqual({
      kube: {
        config: "./kubeconfig"
      }
    });

    expect(processor.Then).toHaveBeenCalledTimes(1);
    expect(processor.Then.mock.calls[0][0]).toEqual("my then step");

    expect(processor.setDefaultTimeout.mock.calls).toHaveLength(1);
    expect(processor.setDefaultTimeout.mock.calls[0][0]).toEqual(10000);

    expect(processor.setWorldConstructor).toHaveBeenCalledTimes(1);
    const World = processor.setWorldConstructor.mock.calls[0][0];
    const world = new World({});
    expect(world.getState("host")).toBe("https://example.com");
    expect(world.data.get("[[ foo ]]")).toBe("bar");

    expect(processor.defineParameterType).toHaveBeenCalledTimes(1);
    const {regexp, transformer, name} =
      processor.defineParameterType.mock.calls[0][0];
    expect(regexp).toEqual(/\[\[(.*)\]\]/);
    expect(name).toEqual("data");
    expect(transformer.call(world, "foo")).toEqual("bar");

    expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(1);
    expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch(
      '🎯 The selected environment is: "local"'
    );
  });
});
