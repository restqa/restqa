const Microservice = require("@restqa/core-microservice");
const {Contributors} = require("@restqa/core-git");
const Performance = require("@restqa/core-performance");
const Specification = require("@restqa/core-specification");
const HttpMock = require("./http-mock");
const Collection = require("@restqa/core-collection");
const path = require("path");
const Coverage = require("./coverage");
const {exit} = require("../utils/process");

module.exports = function ({env, report, config}, processor = {}) {
  global.result = {};
  global.restqa = global.restqa || {};

  if (!processor.BeforeAll || !processor.AfterAll) {
    throw new Error(
      "Please provide a processor containing the methods:  BeforeAll, AfterAll"
    );
  }

  processor.Before(async function (scenario) {
    // In order to fetch the dynamic data from extenral sources.
    // Let's parse the scenario to get all the placeholder
    await this.data.parse(scenario);
  });

  processor.Before({tags: "@skip or @wip"}, function () {
    this.skipped = true;
    return "skipped";
  });

  if (!env) {
    processor.BeforeAll(async function () {
      this.restqa = this.restqa || {};
      let {envs} = this.restqa.mock || {};
      envs = Object.assign(envs || {}, config.getLocalTest().getEnvs());
      const options = {
        port: config.getLocalTest().getPort(),
        command: config.getLocalTest().getCommand(),
        state: global.restqa,
        envs
      };

      const microservice = new Microservice(options);

      if (report) {
        const CoverageOptions = {
          "restqa-report": path.resolve(process.cwd(), "restqa"),
          filename: config.getLocalTest().getCoverage()
        };
        this.restqa.coverage = new Coverage(CoverageOptions);
        microservice.coveragePath = this.restqa.coverage.tmp;
      }

      await microservice.start();
      this.restqa.microservice = microservice;
    });

    processor.AfterAll(async function () {
      if (!this.restqa.microservice) return;
      await this.restqa.microservice.stop();

      if (!this.restqa.coverage) return;
      await this.restqa.coverage.generate();
    });

    process.on("RESTQA.KILL", async (exitCode) => {
      if (this.restqa.microservice) {
        await this.restqa.microservice.stop();
      }
      exit(exitCode);
    });
  }

  if (report) {
    let performanceInstance = null;
    const optionSpecification = {
      info: {
        version: "0.0.1",
        title: config.getName(),
        description: config.getDescription()
      },
      ...config.getSpecification().toJSON()
    };

    const specificationInstance = new Specification(optionSpecification);

    const optionsMock = {
      outputFolder: path.resolve(process.cwd(), "tests", "mocks")
    };
    const httpMockInstance = new HttpMock(optionsMock);

    const optionsCollection = {
      projectName: config.code,
      resultFolder: path.resolve(process.cwd(), "tests")
    };

    const collectionInstance = new Collection(optionsCollection);

    processor.After(function (scenario) {
      if (!this.api) return;
      const exportApi = {
        request: this.api.request,
        response: this.api.response,
        scenario: {
          name: scenario.pickle.name
        }
      };
      specificationInstance.add(exportApi);
    });

    // Performance
    if (!config.getPerformanceTest().isEmpty()) {
      const performance = config.getPerformanceTest().toJSON();

      const {
        tool,
        outputFolder = path.resolve(process.cwd(), "tests", "performance"),
        onlySuccess = true
      } = performance;

      const options = {
        tool,
        outputFolder,
        onlySuccess: Boolean(onlySuccess)
      };
      performanceInstance = new Performance(options);
    }

    processor.After(function (scenario) {
      const {tags = []} = scenario.pickle;
      if (
        tags.find(({name}) => name === "@performance") &&
        performanceInstance
      ) {
        performanceInstance.add(this.apis, scenario);
      }

      httpMockInstance.add(this.apis, scenario);
      collectionInstance.add(this.apis, scenario);
    });

    processor.AfterAll(async function () {
      this.restqa.contributors = await Contributors();
      if (performanceInstance) {
        this.restqa.performance = performanceInstance.generate();
      }

      if (specificationInstance) {
        this.restqa.specification = specificationInstance.format();
      }

      this.restqa.httpMock = httpMockInstance.generate();
      this.restqa.collection = collectionInstance.generate();
    });
  }
};
