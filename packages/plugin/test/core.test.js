const PluginFactory = require("../index");

describe("core usage", () => {
  describe("validation & global", () => {
    it("should throw an error if no cucumber instance is provided, or if it's not an object", () => {
      const pf = new PluginFactory("plugin");

      expect(() => pf._commit()).toThrow(
        new TypeError("Cucumber instance should be an object but got undefined")
      );

      const nullishCucumber = null;
      expect(() => pf._commit(nullishCucumber)).toThrow(
        new TypeError(
          `Cucumber instance should be an object but got ${nullishCucumber}`
        )
      );

      const numberCucumber = 3;
      expect(() => pf._commit(numberCucumber)).toThrow(
        new TypeError(
          `Cucumber instance should be an object but got ${numberCucumber}`
        )
      );

      const arrayCucumber = [];
      expect(() => pf._commit(arrayCucumber)).toThrow(
        new TypeError(
          `Cucumber instance should be an object but got ${arrayCucumber}`
        )
      );

      const stringCucumber = "str";
      expect(() => pf._commit(stringCucumber)).toThrow(
        new TypeError(
          `Cucumber instance should be an object but got ${stringCucumber}`
        )
      );
    });

    it("should not apply cucumber instance if there are steps, hooks or state", () => {
      const pf = new PluginFactory("plugin");

      const After = jest.fn();
      const AfterAll = jest.fn();
      const AfterStep = jest.fn();
      const Before = jest.fn();
      const BeforeAll = jest.fn();
      const BeforeStep = jest.fn();
      const Given = jest.fn();
      const Then = jest.fn();
      const When = jest.fn();
      const cucumberInstance = {
        After,
        AfterAll,
        AfterStep,
        Before,
        BeforeAll,
        BeforeStep,
        Given,
        Then,
        When
      };

      pf._commit(cucumberInstance);

      expect(Given).not.toHaveBeenCalled();
      expect(When).not.toHaveBeenCalled();
      expect(Then).not.toHaveBeenCalled();

      expect(After).not.toHaveBeenCalled();
      expect(AfterAll).not.toHaveBeenCalled();
      expect(Before).not.toHaveBeenCalled();
      expect(BeforeAll).not.toHaveBeenCalled();
    });
  });

  describe("apply steps", () => {
    it("should apply Given from cucumber instance if there are Given steps", () => {
      const pf = new PluginFactory("plugin");
      const Given = jest.fn();

      pf.addGivenStep("yo", () => {}, "yo step");
      pf.addGivenStep("yo", () => {}, "yo step");

      pf._commit({Given});

      expect(Given).toHaveBeenCalledTimes(2);
    });

    it("should throw an error if there Given steps but no Given instance", () => {
      const pf = new PluginFactory("plugin");
      const expectedError = new Error(
        "There are Given steps to bind, cucumber instance should contains Given function"
      );

      pf.addGivenStep("yo", () => {}, "yo step");
      pf.addGivenStep("yo", () => {}, "yo step");

      expect(() => pf._commit({})).toThrow(expectedError);
    });

    it("should apply When from cucumber instance if there are When steps", () => {
      const pf = new PluginFactory("plugin");
      const When = jest.fn();

      pf.addWhenStep("yo", () => {}, "yo step");
      pf.addWhenStep("yo", () => {}, "yo step");

      pf._commit({When});

      expect(When).toHaveBeenCalledTimes(2);
    });

    it("should throw an error if there When steps but no When instance", () => {
      const pf = new PluginFactory("plugin");
      const expectedError = new Error(
        "There are When steps to bind, cucumber instance should contains When function"
      );

      pf.addWhenStep("yo", () => {}, "yo step");
      pf.addWhenStep("yo", () => {}, "yo step");

      expect(() => pf._commit({})).toThrow(expectedError);
    });

    it("should apply Then from cucumber instance if there are Then steps", () => {
      const pf = new PluginFactory("plugin");
      const Then = jest.fn();

      pf.addThenStep("yo", () => {}, "yo step");
      pf.addThenStep("yo", () => {}, "yo step");

      pf._commit({Then});

      expect(Then).toHaveBeenCalledTimes(2);
    });

    it("should throw an error if there Then steps but no Then instances", () => {
      const pf = new PluginFactory("plugin");
      const expectedError = new Error(
        "There are Then steps to bind, cucumber instance should contains Then function"
      );

      pf.addThenStep("yo", () => {}, "yo step");
      pf.addThenStep("yo", () => {}, "yo step");

      expect(() => pf._commit({})).toThrow(expectedError);
    });
  });

  describe("apply hooks", () => {
    it("should apply After from cucumber instance if there are After hooks", () => {
      const pf = new PluginFactory("plugin");
      const After = jest.fn();

      pf.addAfterHook(() => {});
      pf.addAfterHook(() => {});
      pf.addAfterHook(() => {});

      pf._commit({After});

      expect(After).toHaveBeenCalledTimes(3);
    });

    it("should throw an error if there a After hooks but no After instance", () => {
      const pf = new PluginFactory("plugin");
      const expectedError = new Error(
        "There are After hooks to bind, cucumber instance should contains After function"
      );

      pf.addAfterHook(() => {});

      expect(() => pf._commit({})).toThrow(expectedError);
    });

    it("should apply AfterAll from cucumber instance if there are AfterAll hooks", () => {
      const pf = new PluginFactory("plugin");
      const AfterAll = jest.fn();

      pf.addAfterAllHook(() => {});
      pf.addAfterAllHook(() => {});
      pf.addAfterAllHook(() => {});

      pf._commit({AfterAll});

      expect(AfterAll).toHaveBeenCalledTimes(3);
    });

    it("should throw an error if there a AfterAll hooks but no AfterAll instance", () => {
      const pf = new PluginFactory("plugin");
      const expectedError = new Error(
        "There are AfterAll hooks to bind, cucumber instance should contains AfterAll function"
      );

      pf.addAfterAllHook(() => {});

      expect(() => pf._commit({})).toThrow(expectedError);
    });

    it("should apply Before from cucumber instance if there are Before hooks", () => {
      const pf = new PluginFactory("plugin");
      const Before = jest.fn();

      pf.addBeforeHook(() => {});
      pf.addBeforeHook(() => {});
      pf.addBeforeHook(() => {});

      pf._commit({Before});

      expect(Before).toHaveBeenCalledTimes(3);
    });

    it("should throw an error if there a Before hooks but no Before instance", () => {
      const pf = new PluginFactory("plugin");
      const expectedError = new Error(
        "There are Before hooks to bind, cucumber instance should contains Before function"
      );

      pf.addBeforeHook(() => {});

      expect(() => pf._commit({})).toThrow(expectedError);
    });

    it("should apply BeforeAll from cucumber instance if there are BeforeAll hooks", () => {
      const pf = new PluginFactory("plugin");
      const BeforeAll = jest.fn();

      pf.addBeforeAllHook(() => {});
      pf.addBeforeAllHook(() => {});
      pf.addBeforeAllHook(() => {});

      pf._commit({BeforeAll});

      expect(BeforeAll).toHaveBeenCalledTimes(3);
    });

    it("should throw an error if there a BeforeAll hooks but no BeforeAll instance", () => {
      const pf = new PluginFactory("plugin");
      const expectedError = new Error(
        "There are BeforeAll hooks to bind, cucumber instance should contains BeforeAll function"
      );

      pf.addBeforeAllHook(() => {});

      expect(() => pf._commit({})).toThrow(expectedError);
    });
  });

  describe("set config", () => {
    it("config could be set with _commit function", () => {
      const pf = new PluginFactory("plugin");
      const config = {foo: "bar"};

      pf._commit({}, config);

      expect(pf._getConfig()).toEqual(config);
    });

    it("should throw an error if config is not an object", () => {
      const pf = new PluginFactory("plugin");

      const stringConfig = "pool";
      expect(() => pf._commit({}, stringConfig)).toThrow(
        `Config should be an object instead got ${typeof stringConfig}`
      );

      const arrayConfig = [];
      expect(() => pf._commit({}, arrayConfig)).toThrow(
        `Config should be an object instead got array`
      );

      const numberConfig = 3;
      expect(() => pf._commit({}, numberConfig)).toThrow(
        `Config should be an object instead got ${typeof numberConfig}`
      );
    });
  });

  describe("outputs", () => {
    it("_commit should return an PluginFactory instance", () => {
      const pf = new PluginFactory("plugin");

      const applyReturn = pf._commit({});

      expect(applyReturn instanceof PluginFactory).toBeTruthy();
    });

    it("_getState should return the current state", () => {
      const pf = new PluginFactory("plugin");

      const stateProperty = "foo";
      const stateValue = "bar";
      pf.addState(stateProperty, stateValue);

      const state = pf._getState();

      expect(state).toEqual({[stateProperty]: stateValue});
    });

    it("_getState should be called chained to _commit", () => {
      const pf = new PluginFactory("plugin");

      const stateProperty = "foo";
      const stateValue = "bar";
      pf.addState(stateProperty, stateValue);

      const state = pf._commit({})._getState();

      expect(state).toEqual({[stateProperty]: stateValue});
    });
  });
});
