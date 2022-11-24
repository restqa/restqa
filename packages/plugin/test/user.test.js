const PluginFactory = require("../index");

describe("PluginFactory", () => {
  describe("init", () => {
    it("should throw an error if options is not defined", () => {
      expect(() => new PluginFactory()).toThrow();
    });

    it("should throw if name is null or undefined", () => {
      expect(() => new PluginFactory(undefined)).toThrow();
      expect(() => new PluginFactory(null)).toThrow();
    });

    it("should throw if name is not a string", () => {
      expect(() => new PluginFactory(32)).toThrow();
      expect(() => new PluginFactory({})).toThrow();
      expect(() => new PluginFactory([])).toThrow();
    });

    it("should expose plugin name on a property name", () => {
      const fakeName = "test";

      const pf = new PluginFactory(fakeName);

      expect(pf.name).toBe(fakeName);
    });
  });

  describe("adding custom step definition", () => {
    it("should expose and addGivenStep method to add Given steps", () => {
      const pluginName = "test";
      const stepDefinition = "Eat {int} burgers";
      const functionHandler = (burgerCount) =>
        console.log(`I'll eat ${burgerCount} burger!`);
      const description = "Eat burger step";

      const pf = new PluginFactory(pluginName);
      pf.addGivenStep(stepDefinition, functionHandler, description);

      expect(pf._givenSteps).toEqual([
        [stepDefinition, functionHandler, description, [pluginName]]
      ]);
    });

    it("should expose and addWhenStep method to add When steps", () => {
      const pluginName = "test";
      const stepDefinition = "Eat {int} burgers";
      const functionHandler = (burgerCount) =>
        console.log(`I'll eat ${burgerCount} burger!`);
      const description = "Eat burger step";

      const pf = new PluginFactory(pluginName);
      pf.addWhenStep(stepDefinition, functionHandler, description);

      expect(pf._whenSteps).toEqual([
        [stepDefinition, functionHandler, description, [pluginName]]
      ]);
    });

    it("should expose and addThenStep method to add Then steps", () => {
      const pluginName = "test";
      const stepDefinition = "Eat {int} burgers";
      const functionHandler = (burgerCount) =>
        console.log(`I'll eat ${burgerCount} burger!`);
      const description = "Eat burger step";

      const pf = new PluginFactory(pluginName);
      pf.addThenStep(stepDefinition, functionHandler, description);

      expect(pf._thenSteps).toEqual([
        [stepDefinition, functionHandler, description, [pluginName]]
      ]);
    });
  });

  describe("adding hooks", () => {
    it("should expose an addBeforeHook method", () => {
      const pf = new PluginFactory("test");
      const validHook = () => {
        console.log("Hooked !");
      };

      pf.addBeforeHook(validHook);

      expect(pf._beforeHooks).toEqual([[validHook]]);
    });

    it("addBeforeHook should callable with an option object and a hook function", () => {
      const pf = new PluginFactory("test");
      const validOptions = {tags: "@foo"};
      const validHook = () => {
        console.log("Hooked !");
      };

      pf.addBeforeHook(validOptions, validHook);

      expect(pf._beforeHooks).toEqual([[validOptions, validHook]]);
    });

    it("addBeforeHook should callable with a string and a hook function", () => {
      const pf = new PluginFactory("test");
      const validTag = "@foo";
      const validHook = () => {
        console.log("Hooked !");
      };

      pf.addBeforeHook(validTag, validHook);

      expect(pf._beforeHooks).toEqual([[validTag, validHook]]);
    });

    describe("addBeforeHook", () => {
      it("should expose an addBeforeHook method", () => {
        const pf = new PluginFactory("test");
        const validHook = () => {
          console.log("Hooked !");
        };

        pf.addBeforeHook(validHook);

        expect(pf._beforeHooks).toEqual([[validHook]]);
      });

      it("addBeforeHook should callable with an option object (tag, timeout) and a hook function", () => {
        const pf = new PluginFactory("test");
        const validOptions = {
          timeout: 1000,
          tag: "@test"
        };
        const validHook = () => {
          console.log("Hooked !");
        };

        pf.addBeforeHook(validOptions, validHook);

        expect(pf._beforeHooks).toEqual([[validOptions, validHook]]);
      });

      it("addBeforeHook should callable with an option object (timeout) and a hook function", () => {
        const pf = new PluginFactory("test");
        const validOptions = {timeout: 1000};
        const validHook = () => {
          console.log("Hooked !");
        };

        pf.addBeforeHook(validOptions, validHook);

        expect(pf._beforeHooks).toEqual([[validOptions, validHook]]);
      });

      it("addBeforeHook should callable with an option object (tag) and a hook function", () => {
        const pf = new PluginFactory("test");
        const validOptions = {tags: "@foo"};
        const validHook = () => {
          console.log("Hooked !");
        };

        pf.addBeforeHook(validOptions, validHook);

        expect(pf._beforeHooks).toEqual([[validOptions, validHook]]);
      });

      it("addBeforeHook should callable with a string and a hook function", () => {
        const pf = new PluginFactory("test");
        const validTag = "@foo";
        const validHook = () => {
          console.log("Hooked !");
        };

        pf.addBeforeHook(validTag, validHook);

        expect(pf._beforeHooks).toEqual([[validTag, validHook]]);
      });
    });

    describe("addAfterHook", () => {
      it("should expose an addAfterHook method", () => {
        const pf = new PluginFactory("test");
        const validHook = () => {
          console.log("Hooked !");
        };

        pf.addAfterHook(validHook);

        expect(pf._afterHooks).toEqual([[validHook]]);
      });

      it("addAfterHook should callable with an option object (tag, timeout) and a hook function", () => {
        const pf = new PluginFactory("test");
        const validOptions = {
          timeout: 1000,
          tag: "@test"
        };
        const validHook = () => {
          console.log("Hooked !");
        };

        pf.addAfterHook(validOptions, validHook);

        expect(pf._afterHooks).toEqual([[validOptions, validHook]]);
      });

      it("addAfterHook should callable with an option object (timeout) and a hook function", () => {
        const pf = new PluginFactory("test");
        const validOptions = {timeout: 1000};
        const validHook = () => {
          console.log("Hooked !");
        };

        pf.addAfterHook(validOptions, validHook);

        expect(pf._afterHooks).toEqual([[validOptions, validHook]]);
      });

      it("addAfterHook should callable with an option object (tag) and a hook function", () => {
        const pf = new PluginFactory("test");
        const validOptions = {tags: "@foo"};
        const validHook = () => {
          console.log("Hooked !");
        };

        pf.addAfterHook(validOptions, validHook);

        expect(pf._afterHooks).toEqual([[validOptions, validHook]]);
      });

      it("addAfterHook should callable with a string and a hook function", () => {
        const pf = new PluginFactory("test");
        const validTag = "@foo";
        const validHook = () => {
          console.log("Hooked !");
        };

        pf.addAfterHook(validTag, validHook);

        expect(pf._afterHooks).toEqual([[validTag, validHook]]);
      });
    });

    describe("addBeforeAllHook", () => {
      it("should expose an addBeforeAllHook method", () => {
        const pf = new PluginFactory("test");
        const validHook = () => {
          console.log("Hooked !");
        };

        pf.addBeforeAllHook(validHook);

        expect(pf._beforeAllHooks).toEqual([[validHook]]);
      });

      it("addBeforeAllHook should callable with an option object (tag, timeout) and a hook function", () => {
        const pf = new PluginFactory("test");
        const validOptions = {
          timeout: 1000,
          tag: "@test"
        };
        const validHook = () => {
          console.log("Hooked !");
        };

        pf.addBeforeAllHook(validOptions, validHook);

        expect(pf._beforeAllHooks).toEqual([[validOptions, validHook]]);
      });

      it("addBeforeAllHook should callable with an option object (timeout) and a hook function", () => {
        const pf = new PluginFactory("test");
        const validOptions = {timeout: 1000};
        const validHook = () => {
          console.log("Hooked !");
        };

        pf.addBeforeAllHook(validOptions, validHook);

        expect(pf._beforeAllHooks).toEqual([[validOptions, validHook]]);
      });

      it("addBeforeAllHook should callable with an option object (tag) and a hook function", () => {
        const pf = new PluginFactory("test");
        const validOptions = {tags: "@foo"};
        const validHook = () => {
          console.log("Hooked !");
        };

        pf.addBeforeAllHook(validOptions, validHook);

        expect(pf._beforeAllHooks).toEqual([[validOptions, validHook]]);
      });

      it("addBeforeAllHook should callable with a string and a hook function", () => {
        const pf = new PluginFactory("test");
        const validTag = "@foo";
        const validHook = () => {
          console.log("Hooked !");
        };

        pf.addBeforeAllHook(validTag, validHook);

        expect(pf._beforeAllHooks).toEqual([[validTag, validHook]]);
      });

      it("addBeforeAllHook should not be callable with an option object and a hook function", () => {
        const pf = new PluginFactory("test");
        const notValidArg = {tags: "@foo"};
        const expectedError = new TypeError(
          `addBeforeAllHook second parameter should be a function but got undefined`
        );

        expect(() => pf.addBeforeAllHook(notValidArg)).toThrow(expectedError);
      });

      it("addBeforeAllHook should not be callable with a string and a hook function", () => {
        const pf = new PluginFactory("test");
        const notValidArg = "@foo";
        const expectedError = new TypeError(
          `addBeforeAllHook second parameter should be a function but got undefined`
        );

        expect(() => pf.addBeforeAllHook(notValidArg)).toThrow(expectedError);
      });
    });

    describe("addAfterAllHook", () => {
      it("should expose an addAfterAllHook method", () => {
        const pf = new PluginFactory("test");
        const validHook = () => {
          console.log("Hooked !");
        };

        pf.addAfterAllHook(validHook);

        expect(pf._afterAllHooks).toEqual([[validHook]]);
      });

      it("addAfterAllHook should callable with an option object (tag, timeout) and a hook function", () => {
        const pf = new PluginFactory("test");
        const validOptions = {
          timeout: 1000,
          tag: "@test"
        };
        const validHook = () => {
          console.log("Hooked !");
        };

        pf.addAfterAllHook(validOptions, validHook);

        expect(pf._afterAllHooks).toEqual([[validOptions, validHook]]);
      });

      it("addAfterAllHook should callable with an option object (timeout) and a hook function", () => {
        const pf = new PluginFactory("test");
        const validOptions = {timeout: 1000};
        const validHook = () => {
          console.log("Hooked !");
        };

        pf.addAfterAllHook(validOptions, validHook);

        expect(pf._afterAllHooks).toEqual([[validOptions, validHook]]);
      });

      it("addAfterAllHook should callable with an option object (tag) and a hook function", () => {
        const pf = new PluginFactory("test");
        const validOptions = {tags: "@foo"};
        const validHook = () => {
          console.log("Hooked !");
        };

        pf.addAfterAllHook(validOptions, validHook);

        expect(pf._afterAllHooks).toEqual([[validOptions, validHook]]);
      });

      it("addAfterAllHook should callable with a string and a hook function", () => {
        const pf = new PluginFactory("test");
        const validTag = "@foo";
        const validHook = () => {
          console.log("Hooked !");
        };

        pf.addAfterAllHook(validTag, validHook);

        expect(pf._afterAllHooks).toEqual([[validTag, validHook]]);
      });

      it("addAfterAllHook should not be callable with an option object and a hook function", () => {
        const pf = new PluginFactory("test");
        const notValidArg = {tags: "@foo"};
        const expectedError = new TypeError(
          `addAfterAllHook second parameter should be a function but got undefined`
        );

        expect(() => pf.addAfterAllHook(notValidArg)).toThrow(expectedError);
      });

      it("addAfterAllHook should not be callable with a string and a hook function", () => {
        const pf = new PluginFactory("test");
        const notValidArg = "@foo";
        const expectedError = new TypeError(
          `addAfterAllHook second parameter should be a function but got undefined`
        );

        expect(() => pf.addAfterAllHook(notValidArg)).toThrow(expectedError);
      });
    });
  });

  describe("adding state", () => {
    it("should expose an addState method to add a state property", () => {
      const pf = new PluginFactory("state-plugin");
      const property = "restqa";
      const value = {foo: "bar"};

      pf.addState(property, value);

      expect(pf._state).toEqual({[property]: value});
    });

    it("addState should throw if key is not a string", () => {
      const pf = new PluginFactory("plugin");

      const numberKey = 3;
      expect(() => pf.addState(numberKey)).toThrow(
        `addState key parameter should be string, instead got ${typeof numberKey}`
      );

      const objectKey = {};
      expect(() => pf.addState(objectKey)).toThrow(
        `addState key parameter should be string, instead got ${typeof objectKey}`
      );

      const arrayKey = [];
      expect(() => pf.addState(arrayKey)).toThrow(
        `addState key parameter should be string, instead got ${typeof arrayKey}`
      );

      const undefinedKey = undefined;
      expect(() => pf.addState(undefinedKey)).toThrow(
        `addState key parameter should be string, instead got ${typeof undefinedKey}`
      );

      const nullKey = undefined;
      expect(() => pf.addState(nullKey)).toThrow(
        `addState key parameter should be string, instead got ${typeof nullKey}`
      );
    });

    it("addState should throw if key an empty string", () => {
      const pf = new PluginFactory("plugin");
      const emptyString = "";

      expect(() => pf.addState(emptyString)).toThrow(
        "addState key parameter should not be an empty string"
      );
    });
  });

  describe("global", () => {
    it("add hooks methods should be chained", () => {
      const pf = new PluginFactory("my-plugin");

      pf.addAfterHook(() => {}).addAfterAllHook(() => {});

      expect(pf._afterAllHooks).toHaveLength(1);
      expect(pf._afterHooks).toHaveLength(1);

      pf.addBeforeHook(() => {}).addBeforeAllHook(() => {});

      expect(pf._beforeAllHooks).toHaveLength(1);
      expect(pf._beforeHooks).toHaveLength(1);
    });

    it("add steps methods should be chained", () => {
      const pf = new PluginFactory("my-plugin");
      const fakeStep = ["yo", () => {}, "the description"];

      pf.addGivenStep(fakeStep).addGivenStep(fakeStep);

      expect(pf._givenSteps).toHaveLength(2);

      pf.addThenStep(fakeStep).addThenStep(fakeStep);

      expect(pf._thenSteps).toHaveLength(2);

      pf.addWhenStep(fakeStep).addWhenStep(fakeStep);

      expect(pf._whenSteps).toHaveLength(2);
    });

    it("addState method should be chained", () => {
      const pf = new PluginFactory("my-plugin");
      const state = {
        foo: "bar",
        bim: {}
      };

      pf.addState("foo", state.foo).addState("bim", state.bim);

      expect(pf._state).toEqual(state);
    });
  });
});
