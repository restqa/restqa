const Request = require("@restqa/plugin-rest-api/src/rest-api/lib/api/request");

describe("#performance", () => {
  test("throw an error if the configuration doesn't contains the tool", () => {
    const Performance = require("../");
    expect(() => new Performance({})).toThrow(
      'The performance property "tool" should be specify. (available: artillery)'
    );
  });

  describe("add scenario", () => {
    test("Do not add the scenario into if the apis is empty", () => {
      const config = {
        tool: "artillery",
        onlySuccess: true
      };
      const Performance = require("../");
      const instance = new Performance(config);

      expect(instance.add([])).toBe(false);
      expect(instance.features).toEqual({});
    });

    test("Do not add the scenario into if the result of the scenario is not passed", () => {
      const config = {
        tool: "artillery",
        onlySuccess: true
      };
      const Performance = require("../");
      const instance = new Performance(config);

      const api = {
        request: {},
        response: {}
      };

      const scenario = {
        result: {
          duration: 1001000000,
          exception: {
            actual: 201,
            code: "ERR_ASSERTION",
            expected: 200,
            generatedMessage: false,
            operator: "strictEqual"
          },
          status: "failed"
        },
        pickle: {
          line: 4,
          uri: "example/features/users.api.feature"
        }
      };
      expect(instance.add([api], scenario)).toBe(false);
      expect(instance.features).toEqual({});
    });

    test("add the scenario if the passed", () => {
      const config = {
        tool: "artillery"
      };
      const Performance = require("../");
      const instance = new Performance(config);
      const apis = [
        {request: Request("http://localhost", false, "xx-yyy-zzzz")}
      ];

      const scenario = {
        result: {
          duration: 1001000000,
          exception: {
            actual: 201,
            code: "ERR_ASSERTION",
            expected: 200,
            generatedMessage: false,
            operator: "strictEqual"
          },
          status: "passed"
        },
        pickle: {
          line: 4,
          uri: "example/features/users.api.feature"
        }
      };
      expect(instance.add(apis, scenario)).toBe(true);
      const expectedScenarios = {
        "users.api.yml": [
          {
            apis,
            scenario
          }
        ]
      };
      expect(instance.features).toEqual(expectedScenarios);
    });
  });
});
