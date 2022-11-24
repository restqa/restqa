const Given = require("./handlers");
const Plugin = require("../../index");

describe("Given handlers", () => {
  describe("defineVariable", () => {
    test("add a value into a variable", () => {
      const faker = require("faker");
      const spy = jest.spyOn(faker, "fake");
      const $this = {
        attach: jest.fn(),
        data: {
          addProcessor: jest.fn(),
          set: function (key, val) {
            this[`{{ ${key} }}`] = val;
          },
          get: function (key) {
            return this[key];
          }
        },
        getConfig: () => {
          return {};
        }
      };

      Plugin.hooks.before.call($this);

      Given.defineVariable.call($this, "name.firstName", "firstName");

      const expectedName = spy.mock.results[0].value;
      expect($this.data.get("{{ firstName }}")).toBe(expectedName);
      expect($this.attach.mock.calls[0][0]).toBe(
        `[FAKER] Generate a value (name.firstName): ${expectedName}`
      );
    });

    test("throw error if the faker property is not valid", () => {
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
      expect(() => {
        Given.defineVariable.call($this, "name.fourstName", "firstName");
      }).toThrow(
        new Error(
          'The property "name.fourstName" is not valid. Available list at https://github.com/Marak/Faker.js#api-methods'
        )
      );
    });
  });

  describe("locale", () => {
    test("set the locale", () => {
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
      const faker = require("faker");
      Given.locale.call($this, "fr");
      expect(faker.locale).toBe("fr");
    });

    test("Throw an error if the locale is not a part of the available language", () => {
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
      expect(() => {
        Given.locale.call($this, "cn");
      }).toThrow(
        new Error(
          'The locale "cn" is not available please use the list from: https://github.com/Marak/faker.js#localization'
        )
      );
    });
  });
});
