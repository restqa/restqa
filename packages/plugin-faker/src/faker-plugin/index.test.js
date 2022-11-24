beforeEach(() => {
  jest.resetModules();
});

describe("#index", () => {
  test("get name", () => {
    const Plugin = require("./index");
    expect(Plugin.name).toBe("faker");
  });

  test("Add Given steps to the plugin", () => {
    const Plugin = require("./index");
    expect(Plugin.steps.given).toHaveLength(require("./steps/1-given").length);
  });

  describe("Hooks", () => {
    test("hooks change locale but not fake value has been generated", () => {
      const faker = require("faker");
      const spy = jest.spyOn(faker, "fake");

      const Plugin = require("./index");

      const $this = {
        attach: jest.fn(),
        data: {
          addProcessor: jest.fn()
        },
        getConfig: () => {
          return {};
        }
      };

      Plugin.hooks.before.call($this);
      Plugin.hooks.after.call($this);

      expect($this.faker.result).not.toBeUndefined();
      expect($this.faker.get).not.toBeUndefined();
      expect($this.faker.setLocale).not.toBeUndefined();

      expect(spy).not.toHaveBeenCalled();

      expect(faker.locale).toBe("en");
      expect(() => {
        $this.faker.setLocale("ht");
      }).toThrow(
        'The locale "ht" is not available please use the list from: https://github.com/Marak/faker.js#localization'
      );

      expect(() => {
        $this.faker.setLocale("fr");
      }).not.toThrow();

      expect(faker.locale).toBe("fr");
      expect($this.attach).not.toHaveBeenCalled();
    });

    test("hooks change locale and fake value has been generated", () => {
      const faker = require("faker");
      const spy = jest.spyOn(faker, "fake");

      const Plugin = require("./index");

      const $this = {
        attach: jest.fn(),
        data: {
          addProcessor: jest.fn()
        },
        getConfig: () => {
          return {};
        }
      };

      Plugin.hooks.before.call($this);

      const result1 = $this.faker.get("name.firstName");
      const result2 = $this.faker.get("name.lastName");

      Plugin.hooks.after.call($this);

      expect($this.faker.result).not.toBeUndefined();
      expect($this.faker.get).not.toBeUndefined();
      expect($this.faker.setLocale).not.toBeUndefined();

      expect(spy).toHaveBeenCalledTimes(2);

      expect(faker.locale).toBe("en");
      expect(() => {
        $this.faker.setLocale("ht");
      }).toThrow(
        'The locale "ht" is not available please use the list from: https://github.com/Marak/faker.js#localization'
      );

      expect(() => {
        $this.faker.setLocale("fr");
      }).not.toThrow();

      expect(faker.locale).toBe("fr");
      expect(result1).toEqual(spy.mock.results[0].value);
      expect(result2).toEqual(spy.mock.results[1].value);
      const expectedMessage = `
During the scenario faker has generated 2 values for you
  - name.firstName: ${spy.mock.results[0].value}
  - name.lastName: ${spy.mock.results[1].value}
      `.trim();
      expect($this.attach).toHaveBeenCalled();
      expect($this.attach.mock.calls[0][0]).toEqual(expectedMessage);
    });

    test("throw an error if the faker property is invalid (prefix: xxx)", () => {
      const Plugin = require("./index");

      const $this = {
        attach: jest.fn(),
        data: {
          addProcessor: jest.fn()
        },
        getConfig: () => {
          return {
            prefix: "xxx"
          };
        }
      };

      Plugin.hooks.before.call($this);

      expect($this.data.addProcessor).toHaveBeenCalled();
      expect($this.data.addProcessor.mock.calls[0][0]).toEqual("xxx");
      const processor = $this.data.addProcessor.mock.calls[0][1];
      expect(() => {
        processor("music.artist");
      }).toThrow(
        'The property "music.artist" is not valid. Available list at https://github.com/Marak/Faker.js#api-methods'
      );
    });

    test("Get data when its generated from faker (prefix: faker (default))", () => {
      const faker = require("faker");
      const spy = jest.spyOn(faker, "fake");

      const Plugin = require("./index");

      const $this = {
        attach: jest.fn(),
        data: {
          addProcessor: jest.fn()
        },
        getConfig: () => {
          return {};
        }
      };

      Plugin.hooks.before.call($this);

      expect($this.data.addProcessor).toHaveBeenCalled();
      expect($this.data.addProcessor.mock.calls[0][0]).toEqual("faker");
      const processor = $this.data.addProcessor.mock.calls[0][1];
      const result = processor("music.genre");
      Plugin.hooks.after.call($this);

      expect(result).toBe(spy.mock.results[0].value);
      expect($this.faker.result).not.toBeUndefined();
      expect($this.faker.get).not.toBeUndefined();
      expect($this.faker.setLocale).not.toBeUndefined();

      expect(spy).toHaveBeenCalledTimes(1);

      const expectedMessage = `
During the scenario faker has generated 1 values for you
  - music.genre: ${spy.mock.results[0].value}
      `.trim();
      expect($this.attach).toHaveBeenCalled();
      expect($this.attach.mock.calls[0][0]).toEqual(expectedMessage);
    });

    test("Get data when its generated from faker (prefix: _f, locale: es)", () => {
      const faker = require("faker");
      const spy = jest.spyOn(faker, "fake");

      const Plugin = require("./index");

      const $this = {
        attach: jest.fn(),
        data: {
          addProcessor: jest.fn()
        },
        getConfig: () => {
          return {
            locale: "es",
            prefix: "_f"
          };
        }
      };

      Plugin.hooks.before.call($this);

      expect($this.data.addProcessor).toHaveBeenCalled();
      expect($this.data.addProcessor.mock.calls[0][0]).toEqual("_f");
      const processor = $this.data.addProcessor.mock.calls[0][1];
      const result = processor("music.genre");
      expect(result).toBe(spy.mock.results[0].value);
      Plugin.hooks.after.call($this);

      expect($this.faker.result).not.toBeUndefined();
      expect($this.faker.get).not.toBeUndefined();
      expect($this.faker.setLocale).not.toBeUndefined();

      expect(spy).toHaveBeenCalledTimes(1);

      const expectedMessage = `
During the scenario faker has generated 1 values for you
  - music.genre: ${spy.mock.results[0].value}
      `.trim();
      expect($this.attach).toHaveBeenCalled();
      expect($this.attach.mock.calls[0][0]).toEqual(expectedMessage);
      expect(faker.locale).toBe("es");
    });
  });
});
