process.setMaxListeners(Infinity);

const fs = require("fs");
const path = require("path");
const os = require("os");
const YAML = require("yaml");
const {
  CUSTOM_STEP_TEMPLATE,
  CUSTOM_STEP_FILE_NAME
} = require("../services/custom-step-definition.js");

let mockGenerator;

const jestqa = new JestQA(__filename, true);

beforeEach(jestqa.beforeEach);
afterEach(jestqa.afterEach);

jestqa.hooks.beforeEach = function () {
  mockGenerator = jest.fn();
  jest.mock("@restqa/plugin-rest-api", () => ({
    Generator: mockGenerator
  }));

  jest.mock("@restqa/core-microservice", () => {
    return class {
      start() {}
      stop() {}
    };
  });
};

describe("#Cli - Initialize", () => {
  describe("Genereate", () => {
    describe("restqa configuration file and welcome scenario", () => {
      test("Throw an error if the name is not defined", () => {
        const Initialize = require("./initialize");
        const options = {};
        return expect(Initialize.generate(options)).rejects.toThrow(
          "Please share a project name."
        );
      });

      test("Throw an error if the port is not defined", () => {
        const Initialize = require("./initialize");
        const options = {
          name: "sample",
          description: "here a description"
        };
        return expect(Initialize.generate(options)).rejects.toThrow(
          "Please share a project port."
        );
      });

      test("Throw an error if the command is not defined", () => {
        const Initialize = require("./initialize");
        const options = {
          name: "sample",
          description: "here a description",
          port: 8080
        };
        return expect(Initialize.generate(options)).rejects.toThrow(
          "Please share the dev command to run the microservice."
        );
      });

      test("Create config file into a specific folder but first scenario generation failed", async () => {
        const filename = path.resolve(os.tmpdir(), ".restqa.yml");
        jestqa.getCurrent().files.push(filename);

        const prefFilename = path.resolve(
          os.homedir(),
          ".config",
          "restqa.pref"
        );
        jestqa.getCurrent().files.push(prefFilename);

        const Initialize = require("./initialize");

        mockGenerator.mockRejectedValue("Error");

        const options = {
          name: "my sample api",
          description: "This is my description",
          port: 9090,
          command: "npm run dev",
          folder: os.tmpdir(),
          telemetry: false
        };

        await Initialize.generate(options);

        const contentPref = fs.readFileSync(prefFilename).toString("utf-8");
        const resultPref = JSON.parse(contentPref);
        expect(resultPref.telemetry).toBe(false);

        expect(jestqa.getLoggerMock().mock.calls).toHaveLength(3);

        expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch(
          "You have successfully installed RestQA! Let’s begin your test automation with RestQA 💥🚀"
        );
        expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch(
          "We couldn't create the sample scenario but no worries you can generate it using: restqa generate curl http://localhost:9090/ -o welcome.feature"
        );
        expect(jestqa.getLoggerMock().mock.calls[2][0]).toMatch(
          "👉 More information: https://restqa.io/info"
        );

        const content = fs.readFileSync(filename).toString("utf-8");
        const result = YAML.parse(content);

        const expectedContent = {
          version: "0.0.1",
          metadata: {
            code: "MY-SAMPLE-API",
            name: "my sample api",
            description: "This is my description"
          },
          tests: {
            local: {
              port: 9090,
              command: "npm run dev"
            }
          }
        };

        expect(result).toEqual(expectedContent);

        const filenameWelcome = path.resolve(
          os.tmpdir(),
          "tests",
          "local",
          "get.feature"
        );
        jestqa.getCurrent().files.push(filenameWelcome);
        expect(fs.existsSync(filenameWelcome)).toBe(false);
      });

      test("Create config file into a specific folder", async () => {
        const filename = path.resolve(os.tmpdir(), ".restqa.yml");
        jestqa.getCurrent().files.push(filename);

        const prefFilename = path.resolve(
          os.homedir(),
          ".config",
          "restqa.pref"
        );
        jestqa.getCurrent().files.push(prefFilename);

        const Initialize = require("./initialize");

        mockGenerator.mockResolvedValue("Given I have an example");

        const options = {
          name: "my sample api",
          port: 9090,
          command: "npm run dev",
          description: "This is my description",
          folder: os.tmpdir(),
          telemetry: true
        };

        await Initialize.generate(options);

        expect(global.console.info.mock.calls).toHaveLength(3);

        expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch(
          "You have successfully installed RestQA! Let’s begin your test automation with RestQA 💥🚀"
        );
        expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch(
          "🎁 We created a sample scenario, try it by using the command: restqa run"
        );
        expect(jestqa.getLoggerMock().mock.calls[2][0]).toMatch(
          "👉 More information: https://restqa.io/info"
        );

        const contentPref = fs.readFileSync(prefFilename).toString("utf-8");
        const resultPref = JSON.parse(contentPref);
        expect(resultPref.telemetry).toBe(true);

        const content = fs.readFileSync(filename).toString("utf-8");
        const result = YAML.parse(content);

        const expectedContent = {
          version: "0.0.1",
          metadata: {
            code: "MY-SAMPLE-API",
            name: "my sample api",
            description: "This is my description"
          },
          tests: {
            local: {
              port: 9090,
              command: "npm run dev"
            }
          }
        };

        expect(result).toEqual(expectedContent);

        const filenameWelcome = path.resolve(
          os.tmpdir(),
          "tests",
          "local",
          "get.feature"
        );
        jestqa.getCurrent().files.push(filenameWelcome);
        const contentWelcome = fs
          .readFileSync(filenameWelcome)
          .toString("utf-8");
        const expectedWelcomeFeature = `
Feature: GET /

Scenario: Initial API (generated)
Given I have an example`;

        expect(contentWelcome.trim()).toEqual(expectedWelcomeFeature.trim());
      });

      test("Create config file with a default description if its missing", async () => {
        const filename = path.resolve(jestqa.getTmpFolder(), ".restqa.yml");
        jestqa.getCurrent().files.push(filename);

        const prefFilename = path.resolve(
          os.homedir(),
          ".config",
          "restqa.pref"
        );
        jestqa.getCurrent().files.push(prefFilename);

        const Initialize = require("./initialize");

        mockGenerator.mockResolvedValue("Given I have an example");

        const options = {
          name: "my sample api",
          port: 9090,
          command: "npm run dev",
          folder: jestqa.getTmpFolder(),
          telemetry: true
        };

        await Initialize.generate(options);

        expect(global.console.info.mock.calls).toHaveLength(3);

        expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch(
          "You have successfully installed RestQA! Let’s begin your test automation with RestQA 💥🚀"
        );
        expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch(
          "🎁 We created a sample scenario, try it by using the command: restqa run"
        );
        expect(jestqa.getLoggerMock().mock.calls[2][0]).toMatch(
          "👉 More information: https://restqa.io/info"
        );

        const contentPref = fs.readFileSync(prefFilename).toString("utf-8");
        const resultPref = JSON.parse(contentPref);
        expect(resultPref.telemetry).toBe(true);

        const content = fs.readFileSync(filename).toString("utf-8");
        const result = YAML.parse(content);

        const expectedContent = {
          version: "0.0.1",
          metadata: {
            code: "MY-SAMPLE-API",
            name: "my sample api",
            description: "Delicious Microservice maintained with RestQA"
          },
          tests: {
            local: {
              port: 9090,
              command: "npm run dev"
            }
          }
        };

        expect(result).toEqual(expectedContent);

        const filenameWelcome = path.resolve(
          jestqa.getTmpFolder(),
          "tests",
          "local",
          "get.feature"
        );
        jestqa.getCurrent().files.push(filenameWelcome);
        const contentWelcome = fs
          .readFileSync(filenameWelcome)
          .toString("utf-8");
        const expectedWelcomeFeature = `
Feature: GET /

Scenario: Initial API (generated)
Given I have an example`;

        expect(contentWelcome.trim()).toEqual(expectedWelcomeFeature.trim());

        const filenameSteps = path.resolve(
          jestqa.getTmpFolder(),
          "tests",
          CUSTOM_STEP_FILE_NAME
        );
        jestqa.getCurrent().files.push(filenameSteps);
        const contentSteps = fs.readFileSync(filenameSteps).toString("utf-8");
        const expectedContentSteps = CUSTOM_STEP_TEMPLATE;
        expect(contentSteps.trim()).toEqual(expectedContentSteps.trim());
      });
    });
  });

  describe("Initialize", () => {
    test("Generate a restqa config file when package.json do not exist", async () => {
      const ciFilename = path.resolve(process.cwd(), ".gitlab-ci.yml");
      jestqa.getCurrent().files.push(ciFilename);

      const prefFilename = path.resolve(os.homedir(), ".config", "restqa.pref");
      jestqa.getCurrent().files.push(prefFilename);

      const options = {
        name: "my new sample api",
        description: "This is my new description",
        command: "npm run start:dev",
        telemetry: false,
        port: 9090
      };
      const mockPrompt = jest.fn().mockResolvedValue(options);

      jest.mock("inquirer", () => {
        return {
          Separator: jest.fn(),
          prompt: mockPrompt
        };
      });

      const Initialize = require("./initialize");

      await Initialize({
        folder: jestqa.getTmpFolder()
      });

      const contentPref = fs.readFileSync(prefFilename).toString("utf-8");
      const resultPref = JSON.parse(contentPref);
      expect(resultPref.telemetry).toBe(false);

      const filename = jestqa.getConfigFile();
      jestqa.getCurrent().files.push(filename);

      const content = fs.readFileSync(filename).toString("utf-8");
      const result = YAML.parse(content);

      const expectedContent = {
        version: "0.0.1",
        metadata: {
          code: "MY-NEW-SAMPLE-API",
          name: "my new sample api",
          description: "This is my new description"
        },
        tests: {
          local: {
            port: 9090,
            command: "npm run start:dev"
          }
        }
      };
      expect(result).toEqual(expectedContent);
      expect(mockPrompt.mock.calls).toHaveLength(1);
      const expectedQuestions = [
        "Project name:",
        "On which port your microservice is running?",
        "What command are you using to run your microservice (development)?",
        "May RestQA report anonymous usage statistics to improve the tool over time ?"
      ];
      expect(mockPrompt.mock.calls[0][0].map((_) => _.message)).toEqual(
        expectedQuestions
      );
    });

    test("Initialize should not ask for name and propose commands (exclude test) if a package.json exists", async () => {
      // Mocks
      const options = {
        command: "npm run start:dev",
        port: 9090,
        telemetry: false
      };
      const mockPrompt = jest.fn().mockResolvedValue(options);

      jest.mock("inquirer", () => {
        return {
          Separator: jest.fn(),
          prompt: mockPrompt
        };
      });

      const mockPkg = {
        name: "my new sample api",
        description: "This is my new desc",
        scripts: {
          start: "node index.js",
          "start:dev": "nodemon index.js",
          test: "jest"
        }
      };

      jestqa.createTmpFile(JSON.stringify(mockPkg), "package.json");

      // Given
      const Initialize = require("./initialize");

      // When
      await Initialize({folder: jestqa.getTmpFolder()});

      // Then

      const filename = jestqa.getConfigFile();
      jestqa.getCurrent().files.push(filename);

      const content = fs.readFileSync(filename).toString("utf-8");
      const result = YAML.parse(content);

      const expectedContent = {
        version: "0.0.1",
        metadata: {
          code: "MY-NEW-SAMPLE-API",
          name: "my new sample api",
          description: "This is my new desc"
        },
        tests: {
          local: {
            port: 9090,
            command: "npm run start:dev"
          }
        }
      };
      expect(result).toEqual(expectedContent);
      const expectedQuestions = [
        "On which port your microservice is running?",
        "What command are you using to run your microservice (development)?",
        "May RestQA report anonymous usage statistics to improve the tool over time ?"
      ];
      expect(mockPrompt.mock.calls[0][0].map((_) => _.message)).toEqual(
        expectedQuestions
      );

      const [, commandArguments] = mockPrompt.mock.calls[0][0];
      expect(commandArguments.choices).toEqual([
        {
          name: "npm start",
          value: "npm start"
        },
        {
          name: "npm run start:dev",
          value: "npm run start:dev"
        }
      ]);

      const resultGitignore = fs
        .readFileSync(path.resolve(jestqa.getTmpFolder(), ".gitignore"))
        .toString();
      const expectedGitignore = [
        "restqa",
        `tests/mocks`,
        `tests/collections`,
        `tests/integrations`,
        `tests/performances`
      ].join("\n");
      expect(resultGitignore).toEqual(expectedGitignore);
    });
  });
});
