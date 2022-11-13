const RestAPI = require("./index");

afterEach(() => {
  jest.resetModules();
});

describe("#rest-api - index", () => {
  test("name", () => {
    expect(RestAPI.name).toEqual("rest-api");
  });

  test("steps", () => {
    expect(RestAPI.steps.given).not.toHaveLength(0);
    expect(RestAPI.steps.when).not.toHaveLength(0);
    expect(RestAPI.steps.then).not.toHaveLength(0);
  });

  describe("hooks", () => {
    test("before", () => {
      const scenario = {
        pickle: {
          tags: []
        }
      };

      const $this = {
        getConfig: jest.fn().mockReturnValue({
          url: "https://example.com"
        })
      };

      RestAPI.hooks.before.call($this, scenario);
      expect($this.apis).toHaveLength(0);
      expect($this.createApi).not.toBeUndefined();
      $this.createApi();
      expect($this.apis).toHaveLength(1);
      expect($this.apis[0].config.url).toBe("https://example.com");

      $this.createApi("https://example.dev");
      expect($this.apis).toHaveLength(2);
      expect($this.apis[1].config.url).toBe("https://example.dev");
    });

    test("before with insecure tag", () => {
      const scenario = {
        pickle: {
          tags: [
            {
              name: "@insecure",
              astNodeId: "faf08f9e-f046-4fcf-b974-70fd5bf30598"
            }
          ]
        }
      };
      const $this = {
        getConfig: jest.fn().mockReturnValue({
          url: "https://example.com"
        })
      };

      RestAPI.hooks.before.call($this, scenario);
      expect($this.apis).toHaveLength(0);
      expect($this.insecure).toBe(true);
      expect($this.createApi).not.toBeUndefined();
    });

    test("after", () => {
      const scenario = {
        name: "sc1",
        pickle: {
          name: "The scenario name",
          tags: []
        }
      };

      const $this = {
        debug: [
          "Simple Value",
          {
            foo: "bar"
          }
        ],
        log: jest.fn(),
        attach: jest.fn(),
        data: {
          parse: jest.fn()
        },
        apis: [
          {
            toJSON: () => {
              return {
                foo: "bar"
              };
            }
          }
        ]
      };

      RestAPI.hooks.after.call($this, scenario);
      expect($this.log.mock.calls).toHaveLength(4);
      expect($this.log.mock.calls[0][0]).toBe(
        "\n======================== [ DEBUG : The scenario name ] ========================"
      );
      expect($this.log.mock.calls[1][0]).toBe("Simple Value");
      expect($this.log.mock.calls[2][0]).toBe(
        JSON.stringify({foo: "bar"}, null, 2)
      );
      expect($this.log.mock.calls[3][0]).toBe(
        "======================== [ / DEBUG ] ========================"
      );
      expect($this.attach.mock.calls).toHaveLength(1);
      const expectedAttachement = JSON.stringify({
        apis: [{foo: "bar"}]
      });
      expect($this.attach.mock.calls[0][0]).toEqual(expectedAttachement);
      expect($this.attach.mock.calls[0][1]).toEqual("application/json");
    });
  });
});
