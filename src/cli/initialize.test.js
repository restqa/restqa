process.setMaxListeners(Infinity);

const fs = require("fs");
const path = require("path");
const os = require("os");

let mockGenerator;

const jestqa = new JestQA(__filename, true);

beforeEach(jestqa.beforeEach);
afterEach(jestqa.afterEach);

jestqa.hooks.beforeEach = function () {
  mockGenerator = jest.fn();
  jest.mock("@restqa/restqapi", () => ({
    Generator: mockGenerator
  }));
};

describe("#Cli - Initialize", () => {
  describe("Genereate", () => {
    test("Throw an error if the CI is not a part of the list", () => {
      const Initialize = require("./initialize");
      const options = {
        name: "sample",
        description: "my description",
        ci: "GoCd",
        port: 9090
      };
      return expect(Initialize.generate(options)).rejects.toThrow(
        'The continous integration "GoCd" is not supported by RestQa'
      );
    });

    test("Create Github action file if selected", async () => {
      const filename = path.resolve(
        process.cwd(),
        ".github",
        "workflows",
        "integration-test.yml"
      );
      jestqa.getCurrent().files.push(filename);

      const Initialize = require("./initialize");
      const options = {
        name: "sample",
        description: "my description",
        ci: "github-action",
        port: 9090
      };
      await Initialize.generate(options);

      const content = fs.readFileSync(filename).toString("utf-8");
      const YAML = require("yaml");
      const result = YAML.parse(content);
      const expectedContent = {
        name: "RestQA - Integration tests",
        on: ["push"],
        jobs: {
          RestQa: {
            "runs-on": "ubuntu-latest",
            steps: [
              {
                uses: "actions/checkout@v1"
              },
              {
                uses: "restqa/restqa-action@0.0.1",
                with: {
                  path: "tests/"
                }
              },
              {
                name: "RestQA Report",
                uses: "actions/upload-artifact@v2",
                with: {
                  name: "restqa-report",
                  path: "report"
                }
              }
            ]
          }
        }
      };

      expect(result).toEqual(expectedContent);
      expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(4);

      expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch(
        "Github Action configuration has been setup. 🔧"
      );
      expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch(
        "You have successfully installed RestQA! Let’s begin your test automation with RestQA 💥🚀"
      );
      expect(jestqa.getLoggerMock().mock.calls[2][0]).toMatch(
        "🎁 We created a sample scenario, try it by using the command: restqa run"
      );
      expect(jestqa.getLoggerMock().mock.calls[3][0]).toMatch(
        "👉 More information: https://restqa.io/info"
      );
    });

    test("Create Gitlab-ci file if selected", async () => {
      const filename = path.resolve(process.cwd(), ".gitlab-ci.yml");
      jestqa.getCurrent().files.push(filename);

      const Initialize = require("./initialize");
      const options = {
        name: "sample",
        description: "my description",
        ci: "gitlab-ci",
        port: 9090
      };
      await Initialize.generate(options);

      const content = fs.readFileSync(filename).toString("utf-8");
      const YAML = require("yaml");
      const result = YAML.parse(content);

      const expectedContent = {
        stages: ["e2e test"],
        RestQa: {
          stage: "e2e test",
          image: {
            name: "restqa/restqa"
          },
          script: ["restqa run ."],
          artifacts: {
            paths: ["report"]
          }
        }
      };
      expect(result).toEqual(expectedContent);
      expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(4);

      expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch(
        "Gitlab CI configuration has been setup. 🔧"
      );
      expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch(
        "You have successfully installed RestQA! Let’s begin your test automation with RestQA 💥🚀"
      );
      expect(jestqa.getLoggerMock().mock.calls[2][0]).toMatch(
        "🎁 We created a sample scenario, try it by using the command: restqa run"
      );
      expect(jestqa.getLoggerMock().mock.calls[3][0]).toMatch(
        "👉 More information: https://restqa.io/info"
      );
    });

    test("Create Bitbucket pipeline file  if selected", async () => {
      const filename = path.resolve(process.cwd(), "bitbucket-pipelines.yml");
      jestqa.getCurrent().files.push(filename);
      const Initialize = require("./initialize");
      const options = {
        name: "sample",
        description: "my description",
        ci: "bitbucket-pipeline",
        port: 9090
      };
      await Initialize.generate(options);

      const content = fs.readFileSync(filename).toString("utf-8");
      const YAML = require("yaml");
      const result = YAML.parse(content);

      const expectedContent = {
        pipelines: {
          default: [
            {
              step: {
                image: "restqa/restqa",
                script: ["restqa run ."],
                artifacts: ["report/**"]
              }
            }
          ]
        }
      };
      expect(result).toEqual(expectedContent);
      expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(4);

      expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch(
        "Bitbucket Pipeline configuration has been setup. 🔧"
      );
      expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch(
        "You have successfully installed RestQA! Let’s begin your test automation with RestQA 💥🚀"
      );
      expect(jestqa.getLoggerMock().mock.calls[2][0]).toMatch(
        "🎁 We created a sample scenario, try it by using the command: restqa run"
      );
      expect(jestqa.getLoggerMock().mock.calls[3][0]).toMatch(
        "👉 More information: https://restqa.io/info"
      );
    });

    test("Create Circle-ci pipeline file if selected", async () => {
      const filename = path.resolve(process.cwd(), ".circleci/config.yml");
      jestqa.getCurrent().files.push(filename);
      const Initialize = require("./initialize");
      const options = {
        name: "sample",
        description: "my description",
        ci: "circle-ci",
        port: 9090
      };
      await Initialize.generate(options);

      const content = fs.readFileSync(filename).toString("utf-8");
      const YAML = require("yaml");
      const result = YAML.parse(content);

      const expectedContent = {
        version: 2.1,
        jobs: {
          test: {
            docker: [
              {
                image: "restqa/restqa"
              }
            ],
            steps: [
              "checkout",
              {
                run: {
                  name: "Run RestQA integration test",
                  command: "restqa run"
                }
              },
              {
                store_artifacts: {
                  path: "report"
                }
              }
            ]
          }
        },
        workflows: {
          version: 2,
          restqa: {
            jobs: ["test"]
          }
        }
      };

      expect(result).toEqual(expectedContent);
      expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(4);

      expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch(
        "Circle CI configuration has been setup. 🔧"
      );
      expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch(
        "You have successfully installed RestQA! Let’s begin your test automation with RestQA 💥🚀"
      );
      expect(jestqa.getLoggerMock().mock.calls[2][0]).toMatch(
        "🎁 We created a sample scenario, try it by using the command: restqa run"
      );
      expect(jestqa.getLoggerMock().mock.calls[3][0]).toMatch(
        "👉 More information: https://restqa.io/info"
      );
    });

    test("Create travis-ci pipeline file if selected", async () => {
      const filename = path.resolve(process.cwd(), ".travis.yml");
      jestqa.getCurrent().files.push(filename);
      const Initialize = require("./initialize");
      const options = {
        name: "sample",
        description: "my description",
        ci: "travis",
        port: 9090
      };
      mockGenerator.mockResolvedValue("Given I have an example");
      await Initialize.generate(options);

      const content = fs.readFileSync(filename).toString("utf-8");
      const YAML = require("yaml");
      const result = YAML.parse(content);

      const expectedContent = {
        dist: "trusty",
        jobs: {
          include: [
            {
              stage: "test",
              script: "docker run --rm -v $PWD:/app restqa/restqa"
            }
          ]
        }
      };

      expect(result).toEqual(expectedContent);
      expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(4);

      expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch(
        "Travis CI configuration has been setup. 🔧"
      );
      expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch(
        "You have successfully installed RestQA! Let’s begin your test automation with RestQA 💥🚀"
      );
      expect(jestqa.getLoggerMock().mock.calls[2][0]).toMatch(
        "🎁 We created a sample scenario, try it by using the command: restqa run"
      );
      expect(jestqa.getLoggerMock().mock.calls[3][0]).toMatch(
        "👉 More information: https://restqa.io/info"
      );
    });

    test("Create Jenkinsfile if jenkins is  selected", async () => {
      const filename = path.resolve(process.cwd(), "Jenkinsfile");
      jestqa.getCurrent().files.push(filename);

      const Initialize = require("./initialize");
      const options = {
        name: "sample",
        description: "my description",
        ci: "jenkins",
        port: 9090
      };
      await Initialize.generate(options);

      const content = fs.readFileSync(filename).toString("utf-8");
      const expectedContent = `
pipeline {
    agent { label 'master' }

    stages {
        stage('RestQA') {
            steps {
                script {
                    sh "ls -lah"
                    sh "docker run -v \${env.WORKSPACE}:/app restqa/restqa"
                    
                    archiveArtifacts artifacts: 'report/'
                }
            }
        }
    }
}`.trim();

      expect(content).toEqual(expectedContent);

      expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(4);
      expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch(
        "Jenkins configuration has been setup. 🔧"
      );
      expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch(
        "You have successfully installed RestQA! Let’s begin your test automation with RestQA 💥🚀"
      );
      expect(jestqa.getLoggerMock().mock.calls[2][0]).toMatch(
        "🎁 We created a sample scenario, try it by using the command: restqa run"
      );
      expect(jestqa.getLoggerMock().mock.calls[3][0]).toMatch(
        "👉 More information: https://restqa.io/info"
      );
    });

    test("Do nothing if any CI hasn't been selected", async () => {
      const Initialize = require("./initialize");
      const options = {
        name: "sample",
        description: "my description",
        ci: false,
        port: 9090
      };
      await Initialize.generate(options);

      let filename = path.resolve(process.cwd(), "bitbucket-pipelines.yml");
      expect(fs.existsSync(filename)).toBe(false);
      filename = path.resolve(process.cwd(), ".gitlab-ci.yml");
      expect(fs.existsSync(filename)).toBe(false);
      filename = path.resolve(
        process.cwd(),
        ".github",
        "workflows",
        "integration-test.yml"
      );
      expect(fs.existsSync(filename)).toBe(false);
      filename = path.resolve(process.cwd(), "circleci", "config.yml");
      expect(fs.existsSync(filename)).toBe(false);
      filename = path.resolve(process.cwd(), "travis.yml");
      expect(fs.existsSync(filename)).toBe(false);
    });

    test("Do nothing if any CI hasn't been answered", async () => {
      const Initialize = require("./initialize");
      const options = {
        name: "sample",
        description: "my description",
        port: 9090
      };
      await Initialize.generate(options);

      let filename = path.resolve(process.cwd(), "bitbucket-pipelines.yml");
      expect(fs.existsSync(filename)).toBe(false);
      filename = path.resolve(process.cwd(), ".gitlab-ci.yml");
      expect(fs.existsSync(filename)).toBe(false);
      filename = path.resolve(
        process.cwd(),
        ".github",
        "workflows",
        "integration-test.yml"
      );
      expect(fs.existsSync(filename)).toBe(false);
      filename = path.resolve(process.cwd(), "circleci", "config.yml");
      expect(fs.existsSync(filename)).toBe(false);
      filename = path.resolve(process.cwd(), "travis.yml");
      expect(fs.existsSync(filename)).toBe(false);
    });

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
          "We couldn't create the sample scenario but no worries you can generate it using: restqa generate curl https://restqa.io/welcome.json -o welcome.feature"
        );
        expect(jestqa.getLoggerMock().mock.calls[2][0]).toMatch(
          "👉 More information: https://restqa.io/info"
        );

        const content = fs.readFileSync(filename).toString("utf-8");
        const YAML = require("yaml");
        const result = YAML.parse(content);

        const expectedContent = {
          version: "0.0.1",
          metadata: {
            code: "MY-SAMPLE-API",
            name: "my sample api",
            description: "This is my description"
          },
          environments: [
            {
              name: "local",
              default: true,
              plugins: [
                {
                  name: "@restqa/restqapi",
                  config: {
                    url: `http://localhost:${options.port}`
                  }
                }
              ],
              outputs: [
                {
                  type: "html",
                  enabled: true
                },
                {
                  type: "file",
                  enabled: true,
                  config: {
                    path: "restqa-result.json"
                  }
                }
              ]
            }
          ]
        };

        expect(result).toEqual(expectedContent);

        const filenameWelcome = path.resolve(
          os.tmpdir(),
          "tests",
          "integration",
          "welcome-restqa.feature"
        );
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
        const YAML = require("yaml");
        const result = YAML.parse(content);

        const expectedContent = {
          version: "0.0.1",
          metadata: {
            code: "MY-SAMPLE-API",
            name: "my sample api",
            description: "This is my description"
          },
          environments: [
            {
              name: "local",
              default: true,
              plugins: [
                {
                  name: "@restqa/restqapi",
                  config: {
                    url: `http://localhost:${options.port}`
                  }
                }
              ],
              outputs: [
                {
                  type: "html",
                  enabled: true
                },
                {
                  type: "file",
                  enabled: true,
                  config: {
                    path: "restqa-result.json"
                  }
                }
              ]
            }
          ]
        };
        expect(result).toEqual(expectedContent);

        const filenameWelcome = path.resolve(
          os.tmpdir(),
          "tests",
          "integration",
          "welcome-restqa.feature"
        );
        jestqa.getCurrent().files.push(filenameWelcome);
        const contentWelcome = fs
          .readFileSync(filenameWelcome)
          .toString("utf-8");
        const expectedWelcomeFeature = `
Feature: Welcome to the RestQA community

Scenario: Get the list of useful RestQA resources
Given I have an example`;

        expect(contentWelcome.trim()).toEqual(expectedWelcomeFeature.trim());
      });
    });
  });

  describe("Initialize", () => {
    test("Generate a restqa config and a ci file", async () => {
      const ciFilename = path.resolve(process.cwd(), ".gitlab-ci.yml");
      jestqa.getCurrent().files.push(ciFilename);

      const prefFilename = path.resolve(os.homedir(), ".config", "restqa.pref");
      jestqa.getCurrent().files.push(prefFilename);

      const options = {
        name: "my new sample api",
        description: "This is my new description",
        ci: "gitlab-ci",
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

      await Initialize({});

      const contentPref = fs.readFileSync(prefFilename).toString("utf-8");
      const resultPref = JSON.parse(contentPref);
      expect(resultPref.telemetry).toBe(false);

      const contentCi = fs.readFileSync(ciFilename).toString("utf-8");
      const YAML = require("yaml");
      const resultCi = YAML.parse(contentCi);

      const expectedContentCi = {
        stages: ["e2e test"],
        RestQa: {
          stage: "e2e test",
          image: {
            name: "restqa/restqa"
          },
          script: ["restqa run ."],
          artifacts: {
            paths: ["report"]
          }
        }
      };
      expect(resultCi).toEqual(expectedContentCi);

      const filename = path.resolve(process.cwd(), ".restqa.yml");
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
        environments: [
          {
            name: "local",
            default: true,
            plugins: [
              {
                name: "@restqa/restqapi",
                config: {
                  url: `http://localhost:${options.port}`
                }
              }
            ],
            outputs: [
              {
                type: "html",
                enabled: true
              },
              {
                type: "file",
                enabled: true,
                config: {
                  path: "restqa-result.json"
                }
              }
            ]
          }
        ]
      };
      expect(result).toEqual(expectedContent);
      expect(mockPrompt.mock.calls).toHaveLength(1);
      const expectedQuestions = [
        "On which port your microservice is running?",
        "Do you need a continuous integration configuration ?",
        "May RestQA report anonymous usage statistics to improve the tool over time ?"
      ];
      expect(mockPrompt.mock.calls[0][0].map((_) => _.message)).toEqual(
        expectedQuestions
      );
      const expectedCI = [
        {
          name: "Github Action",
          value: "github-action"
        },
        {
          name: "Gitlab Ci",
          value: "gitlab-ci"
        },
        {
          name: "Bitbucket Pipelines",
          value: "bitbucket-pipeline"
        },
        {
          name: "Circle Ci",
          value: "circle-ci"
        },
        {
          name: "Travis Ci",
          value: "travis"
        },
        {
          name: "Jenkins",
          value: "jenkins"
        }
      ];

      const [, ciPromptArgument] = mockPrompt.mock.calls[0][0];
      expect(ciPromptArgument.choices).toEqual(
        expect.arrayContaining(expectedCI)
      );
    });

    test("Generate a restqa config Generate it without having it ask any questions", async () => {
      const mockPrompt = jest.fn();

      jest.mock("inquirer", () => {
        return {
          Separator: jest.fn(),
          prompt: mockPrompt
        };
      });

      const Initialize = require("./initialize");

      await Initialize({y: true});

      const YAML = require("yaml");

      let filename = path.resolve(process.cwd(), ".restqa.yml");
      jestqa.getCurrent().files.push(filename);
      const content = fs.readFileSync(filename).toString("utf-8");
      const result = YAML.parse(content);

      const expectedContent = {
        version: "0.0.1",
        metadata: {
          code: "APP",
          name: "app",
          description: "Configuration generated by restqa init"
        },
        environments: [
          {
            name: "local",
            default: true,
            plugins: [
              {
                name: "@restqa/restqapi",
                config: {
                  url: "http://localhost:8000"
                }
              }
            ],
            outputs: [
              {
                type: "html",
                enabled: true
              },
              {
                type: "file",
                enabled: true,
                config: {
                  path: "restqa-result.json"
                }
              }
            ]
          }
        ]
      };
      expect(result).toEqual(expectedContent);
      expect(mockPrompt.mock.calls).toHaveLength(0);

      filename = path.resolve(process.cwd(), "bitbucket-pipelines.yml");
      expect(fs.existsSync(filename)).toBe(false);
      filename = path.resolve(process.cwd(), ".gitlab-ci.yml");
      expect(fs.existsSync(filename)).toBe(false);
      filename = path.resolve(
        process.cwd(),
        ".github",
        "workflows",
        "integration-test.yml"
      );
      expect(fs.existsSync(filename)).toBe(false);
      filename = path.resolve(process.cwd(), "circleci", "config.yml");
      expect(fs.existsSync(filename)).toBe(false);
    });

    test("Initialize should ask for name and description if a package.json doesn't exists", async () => {
      // Mocks
      const options = {
        name: "my sample api",
        description: "This is my description",
        port: 9090,
        folder: os.tmpdir(),
        telemetry: false
      };
      const mockPrompt = jest.fn().mockResolvedValue(options);

      jest.mock("inquirer", () => {
        return {
          Separator: jest.fn(),
          prompt: mockPrompt
        };
      });

      // Given
      jest
        .spyOn(require("../utils/fs"), "getPackageJson")
        .mockReturnValue(null);
      const Initialize = require("./initialize");

      // When
      await Initialize({y: false});

      // Then
      const expectedQuestions = [
        "Project name:",
        "On which port your microservice is running?",
        "Do you need a continuous integration configuration ?",
        "May RestQA report anonymous usage statistics to improve the tool over time ?"
      ];
      expect(mockPrompt.mock.calls[0][0].map((_) => _.message)).toEqual(
        expectedQuestions
      );
    });

    test("Initialize should call Initialize.generate with a name if package json exists", async () => {
      // Mocks
      const options = {
        port: 9090,
        folder: os.tmpdir(),
        telemetry: false
      };
      const mockPrompt = jest.fn().mockResolvedValue(options);

      jest.mock("inquirer", () => {
        return {
          Separator: jest.fn(),
          prompt: mockPrompt
        };
      });
      const Initialize = require("./initialize");
      Initialize.generate = jest.fn();

      // Given, When
      await Initialize({y: false});

      // Then
      expect(Initialize.generate).toHaveBeenCalledWith(
        expect.objectContaining({
          port: options.port,
          telemetry: options.telemetry,
          name: "@restqa/restqa",
          description: "An all in one test automation runner"
        })
      );
    });

    test("Initialize.generate should not throw if called without description", async () => {
      // Given
      const optionsWithoutDescription = {
        port: 9999,
        telemetry: false,
        name: "@restqa/restqa"
      };
      const Initialize = require("./initialize");

      // When
      try {
        await Initialize.generate(optionsWithoutDescription);
        // Then
        expect(true).toEqual(true);
      } catch {
        throw new Error("Should not throw");
      }
    });
  });
});
