const Config = require("./index");
const fs = require('fs')
const path = require('path')
const YAML = require('yaml')

const jestqa = new JestQA(__filename, true);

beforeEach(jestqa.beforeEach);
afterEach(jestqa.afterEach);

describe("#Config instance", () => {
  test("Throw error when trying to Load a restqa file but file doesn't exist", () => {
    const Instance = new Config();
    expect(() => {
      Instance.load("");
    }).toThrow(`The configuration file locate at "" doesn't exist.`);
  });

  test("Throw error when the loaded file is not formated properly", () => {
    const invalidConfigFile = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: "@restqa/restqapi"
        config:
          foo: bar
      - name: "@restqa/http-mock-plugin"
        config:
          debug: false
          port: 8888
          envs:
            GITHUB_API: github
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `;
    const filename = jestqa.createTmpFile(invalidConfigFile, ".restqa.yml");

    const Instance = new Config();
    expect(() => {
      Instance.load(filename);
    }).toThrow(`"environments" is not allowed`);
  });

  test("Successfull file load", () => {
    const validRestQAConfigFile = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The description of the test api
tests:
  unit:
    port: 8080
    command: npm run dev
    data:
      storage: "./test/data"
      channel: excel
      config: 
        foo: bar
      variables:
        key: value
  integrations:
    - name: UAT
      url: "http://uat.example.com"
      data:
        storage: "./test/data"
        channel: google-sheet
        config: 
          hello: world
        startSymbol: "[["
        endSymbol: "]]"
      outputs:
      - type: html
        enabled: true
    - name: PROD
      url: "http://example.com"
      data:
        variables: 
          key: prod
      outputs:
      - type: file
        enabled: true
  performance:
    tool: artillery
    outputFolder: "tests/performance"
    onlySuccess: true
specification:
  title: "override title"
  description: "override description"
collection:
  tool: "postman"
  exportFile: "./postman-collection.yml"
      
plugins:
  - name: "@restqa/http-mock-plugin"
    config:
      debug: false
      port: 8888
      envs:
        GITHUB_API: github
    `;
    const filename = jestqa.createCwdConfig(validRestQAConfigFile);
    const Instance = new Config();
    Instance.load(filename);
    // metadata
    expect(Instance.getCode()).toEqual("API");
    expect(Instance.getName()).toEqual("My test API");
    expect(Instance.getDescription()).toEqual(
      "The description of the test api"
    );

    // unit test
    expect(Instance.getUnitTest().getPort()).toEqual(8080);
    expect(Instance.getUnitTest().getCommand()).toEqual("npm run dev");
    expect(Instance.getUnitTest().getName()).toEqual("local");
    expect(Instance.getUnitTest().getUrl()).toEqual("http://localhost:8080");
    expect(Instance.getUnitTest().getData().getStorage()).toEqual(
      "./test/data"
    );
    expect(Instance.getUnitTest().getData().getChannel()).toEqual("excel");
    expect(Instance.getUnitTest().getData().getConfig()).toEqual({foo: "bar"});
    expect(Instance.getUnitTest().getData().getStartSymbol()).toEqual("{{");
    expect(Instance.getUnitTest().getData().getEndSymbol()).toEqual("}}");
    expect(Instance.getUnitTest().getData().getVariables()).toEqual({
      key: "value"
    });

    // integration test
    expect(Instance.getIntegrationTests()[0].getName()).toEqual("UAT");
    expect(Instance.getIntegrationTests()[0].getUrl()).toEqual(
      "http://uat.example.com"
    );
    expect(Instance.getIntegrationTests()[0].getOutputs()).toEqual([
      {
        type: "html",
        enabled: true
      }
    ]);
    expect(Instance.getIntegrationTests()[1].getName()).toEqual("PROD");
    expect(Instance.getIntegrationTests()[1].getUrl()).toEqual(
      "http://example.com"
    );
    expect(Instance.getIntegrationTests()[1].getOutputs()).toEqual([
      {
        type: "file",
        enabled: true
      }
    ]);

    expect(Instance.getIntegrationTest("uat").getName()).toEqual("UAT");
    expect(Instance.getIntegrationTest("uat").getUrl()).toEqual(
      "http://uat.example.com"
    );
    expect(Instance.getIntegrationTest("uat").getOutputs()).toEqual([
      {
        type: "html",
        enabled: true
      }
    ]);
    expect(Instance.getIntegrationTest("uat").getData().getStorage()).toEqual(
      "./test/data"
    );
    expect(Instance.getIntegrationTest("uat").getData().getChannel()).toEqual(
      "google-sheet"
    );
    expect(Instance.getIntegrationTest("uat").getData().getConfig()).toEqual({
      hello: "world"
    });
    expect(
      Instance.getIntegrationTest("uat").getData().getStartSymbol()
    ).toEqual("[[");
    expect(Instance.getIntegrationTest("uat").getData().getEndSymbol()).toEqual(
      "]]"
    );

    expect(Instance.getIntegrationTest("prod").getName()).toEqual("PROD");
    expect(Instance.getIntegrationTest("prod").getUrl()).toEqual(
      "http://example.com"
    );
    expect(Instance.getIntegrationTest("prod").getOutputs()).toEqual([
      {
        type: "file",
        enabled: true
      }
    ]);
    expect(
      Instance.getIntegrationTest("prod").getData().getStartSymbol()
    ).toEqual("{{");
    expect(
      Instance.getIntegrationTest("prod").getData().getEndSymbol()
    ).toEqual("}}");
    expect(
      Instance.getIntegrationTest("prod").getData().getVariables()
    ).toEqual({key: "prod"});

    expect(() => Instance.getIntegrationTest("testing")).toThrow(
      `The environment "testing" doesn't exist. Available: UAT, PROD`
    );

    // performance test
    expect(Instance.getPerformanceTest().getTool()).toEqual("artillery");
    expect(Instance.getPerformanceTest().getOutputFolder()).toEqual(
      "tests/performance"
    );
    expect(Instance.getPerformanceTest().isOnlySuccess()).toEqual(true);

    // specification
    expect(Instance.getSpecification().getTitle()).toEqual("override title");
    expect(Instance.getSpecification().getDescription()).toEqual(
      "override description"
    );

    // collection
    expect(Instance.getCollection().getTool()).toEqual("postman");
    expect(Instance.getCollection().getExportFile()).toEqual(
      "./postman-collection.yml"
    );

    // plugins
    expect(Instance.getPlugins()).toHaveLength(1);
    expect(Instance.getPlugins()[0].getName()).toEqual(
      "@restqa/http-mock-plugin"
    );
    expect(Instance.getPlugins()[0].getConfig()).toEqual({
      debug: false,
      port: 8888,
      envs: {
        GITHUB_API: "github"
      }
    });

    expect(Instance.getPlugin("@restqa/http-mock-plugin").getName()).toEqual(
      "@restqa/http-mock-plugin"
    );
    expect(Instance.getPlugin("@restqa/http-mock-plugin").getConfig()).toEqual({
      debug: false,
      port: 8888,
      envs: {
        GITHUB_API: "github"
      }
    });

    expect(() => Instance.getPlugin("@restqa/missing-plugin")).toThrow(
      `The @restqa/missing-plugin hasn't been declared.`
    );
  });

  test("Successfull file load with Environment variable", () => {
    process.env.URL = "http://uat.example.com";
    const validRestQAConfigFile = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The description of the test api
tests:
  unit:
    port: 8080
    command: npm run dev
  integrations:
    - name: UAT
      url: !env-var URL
      outputs:
      - type: html
        enabled: true
    - name: PROD
      url: "http://example.com"
      outputs:
      - type: file
        enabled: true
  performance:
    tool: artillery
    outputFolder: "tests/performance"
    onlySuccess: true
specification:
  title: "override title"
  description: "override description"
collection:
  tool: "postman"
  exportFile: "./postman-collection.yml"
      
plugins:
  - name: "@restqa/http-mock-plugin"
    config:
      debug: false
      port: 8888
      envs:
        GITHUB_API: github

settings:
  timeout: 2000
  tips:
    enabled: true
    messages:
    - My message
    `;
    const filename = jestqa.createCwdConfig(validRestQAConfigFile);
    const Instance = new Config();
    Instance.load(filename);
    // metadata
    expect(Instance.getCode()).toEqual("API");
    expect(Instance.getName()).toEqual("My test API");
    expect(Instance.getDescription()).toEqual(
      "The description of the test api"
    );

    // unit test
    expect(Instance.getUnitTest().getPort()).toEqual(8080);
    expect(Instance.getUnitTest().getCommand()).toEqual("npm run dev");

    // integration test
    expect(Instance.getIntegrationTests()[0].getName()).toEqual("UAT");
    expect(Instance.getIntegrationTests()[0].getUrl()).toEqual(
      "http://uat.example.com"
    );
    expect(Instance.getIntegrationTests()[0].getOutputs()).toEqual([
      {
        type: "html",
        enabled: true
      }
    ]);
    expect(Instance.getIntegrationTests()[1].getName()).toEqual("PROD");
    expect(Instance.getIntegrationTests()[1].getUrl()).toEqual(
      "http://example.com"
    );
    expect(Instance.getIntegrationTests()[1].getOutputs()).toEqual([
      {
        type: "file",
        enabled: true
      }
    ]);

    expect(Instance.getIntegrationTest("uat").getName()).toEqual("UAT");
    expect(Instance.getIntegrationTest("uat").getUrl()).toEqual(
      "http://uat.example.com"
    );
    expect(Instance.getIntegrationTest("uat").getOutputs()).toEqual([
      {
        type: "html",
        enabled: true
      }
    ]);
    expect(Instance.getIntegrationTest("prod").getName()).toEqual("PROD");
    expect(Instance.getIntegrationTest("prod").getUrl()).toEqual(
      "http://example.com"
    );
    expect(Instance.getIntegrationTest("prod").getOutputs()).toEqual([
      {
        type: "file",
        enabled: true
      }
    ]);

    expect(() => Instance.getIntegrationTest("testing")).toThrow(
      `The environment "testing" doesn't exist. Available: UAT, PROD`
    );

    // performance test
    expect(Instance.getPerformanceTest().getTool()).toEqual("artillery");
    expect(Instance.getPerformanceTest().getOutputFolder()).toEqual(
      "tests/performance"
    );
    expect(Instance.getPerformanceTest().isOnlySuccess()).toEqual(true);

    // specification
    expect(Instance.getSpecification().getTitle()).toEqual("override title");
    expect(Instance.getSpecification().getDescription()).toEqual(
      "override description"
    );

    // collection
    expect(Instance.getCollection().getTool()).toEqual("postman");
    expect(Instance.getCollection().getExportFile()).toEqual(
      "./postman-collection.yml"
    );

    // plugins
    expect(Instance.getPlugins()).toHaveLength(1);
    expect(Instance.getPlugins()[0].getName()).toEqual(
      "@restqa/http-mock-plugin"
    );
    expect(Instance.getPlugins()[0].getConfig()).toEqual({
      debug: false,
      port: 8888,
      envs: {
        GITHUB_API: "github"
      }
    });

    expect(Instance.getPlugin("@restqa/http-mock-plugin").getName()).toEqual(
      "@restqa/http-mock-plugin"
    );
    expect(Instance.getPlugin("@restqa/http-mock-plugin").getConfig()).toEqual({
      debug: false,
      port: 8888,
      envs: {
        GITHUB_API: "github"
      }
    });

    expect(() => Instance.getPlugin("@restqa/missing-plugin")).toThrow(
      `The @restqa/missing-plugin hasn't been declared.`
    );
    expect(Instance.getSettings().getTimeout()).toEqual(2000);
    expect(Instance.getSettings().getTips()).toEqual({
      enabled: true,
      messages: ["My message"]
    });
  });

  test("Create a config file", () => {
    const Instance = new Config();
    Instance.setName("my config name");
    Instance.setDescription("my config description");
    Instance.getUnitTest().setPort(8080);
    Instance.getUnitTest().setCommand("npm run dev");
    Instance.getUnitTest().getData().setStorage("./my-storage");
    Instance.getUnitTest().getData().setChannel("excel");
    Instance.getUnitTest().getData().setConfig({key: "val"});
    Instance.getUnitTest().getData().setStartSymbol("[[");
    Instance.getUnitTest().getData().setEndSymbol("]]");
    Instance.getUnitTest().getData().addVariables("foo", "bar");

    Instance.addIntegration("UAT", "https://uat.example.com");
    Instance.getIntegrationTest("uat").addOutput({
      type: "html",
      enabled: true
    });
    Instance.getIntegrationTest("uat").getData().setStartSymbol("<<");
    Instance.getIntegrationTest("uat").getData().setEndSymbol(">>");

    Instance.getPerformanceTest().setTool("artillery");
    Instance.getPerformanceTest().setOutputFolder("./test/performance");
    Instance.getPerformanceTest().setOnlySuccess(true);

    Instance.getSpecification().setTitle("my spec title");
    Instance.getSpecification().setDescription("my spec description");

    Instance.getCollection().setTool("postman");
    Instance.getCollection().setExportFile("./postman.collection.json");

    Instance.addPlugin("@restqa/plugin", {
      foo: "bar"
    });

    Instance.getSettings().setTimeout(100000);

    expect(Instance.toJSON()).toEqual({
      version: "0.0.1",
      metadata: {
        code: "MY-CONFIG-NAME",
        name: "my config name",
        description: "my config description"
      },
      tests: {
        unit: {
          port: 8080,
          command: "npm run dev",
          data: {
            storage: "./my-storage",
            channel: "excel",
            config: {
              key: "val"
            },
            startSymbol: "[[",
            endSymbol: "]]",
            variables: {
              foo: "bar"
            }
          }
        },
        integrations: [
          {
            name: "UAT",
            url: "https://uat.example.com",
            data: {
              startSymbol: "<<",
              endSymbol: ">>"
            },
            outputs: [
              {
                type: "html",
                enabled: true
              }
            ]
          }
        ],
        performance: {
          tool: "artillery",
          outputFolder: "./test/performance",
          onlySuccess: true
        }
      },
      specification: {
        title: "my spec title",
        description: "my spec description"
      },
      collection: {
        tool: "postman",
        exportFile: "./postman.collection.json"
      },
      plugins: [
        {
          name: "@restqa/plugin",
          config: {
            foo: "bar"
          }
        }
      ],
      settings: {
        timeout: 100000
      }
    });

    const expectedYAML = `
version: 0.0.1
metadata:
  code: MY-CONFIG-NAME
  name: my config name
  description: my config description
tests:
  unit:
    port: 8080
    command: npm run dev
    data:
      storage: ./my-storage
      channel: excel
      config:
        key: val
      startSymbol: "[["
      endSymbol: "]]"
      variables:
        foo: bar
  integrations:
    - name: UAT
      url: https://uat.example.com
      outputs:
        - type: html
          enabled: true
      data:
        startSymbol: <<
        endSymbol: ">>"
  performance:
    tool: artillery
    outputFolder: ./test/performance
    onlySuccess: true
specification:
  title: my spec title
  description: my spec description
collection:
  tool: postman
  exportFile: ./postman.collection.json
plugins:
  - name: "@restqa/plugin"
    config:
      foo: bar
settings:
  timeout: 100000
`;
    expect(Instance.toYAML().trim()).toEqual(expectedYAML.trim());
  });

  test('Save config file using the default description', () => {
    const Instance = new Config();
    Instance.setName("my config name");
    Instance.getUnitTest().setPort(8080);
    Instance.getUnitTest().setCommand("npm run dev");
    const filename = path.resolve(jestqa.getTmpFolder(), '.restqa.yml')
    Instance.save(filename)
    expect(fs.existsSync(filename)).toBeTruthy()

    const content = fs.readFileSync(filename).toString("utf-8");
    const result = YAML.parse(content);

    const expectedContent = {
      version: "0.0.1",
      metadata: {
        code: "MY-CONFIG-NAME",
        name: "my config name",
        description: "Delicious Microservice maintained with RestQA",
      },
      tests: {
        unit: {
          port: 8080,
          command: "npm run dev"
        }
      }
    };

    expect(result).toEqual(expectedContent);
  })
});
