const faker = require("faker");

module.exports = {
  name: "faker",
  steps: {
    given: require("./steps/1-given")
  },
  hooks: {
    before: function () {
      const config = this.getConfig("faker");
      faker.locale = config.locale || "en";

      const states = {
        result: [],
        get: function (property) {
          try {
            const value = faker.fake(`{{${property}}}`);
            this.result.push({property, value});
            return value;
          } catch (err) {
            throw new Error(
              `The property "${err.message
                .split(" ")
                .pop()}" is not valid. Available list at https://github.com/Marak/Faker.js#api-methods`
            );
          }
        },
        setLocale: (locale) => {
          if (Object.keys(faker.locales).includes(locale) === false) {
            throw new Error(
              `The locale "${locale}" is not available please use the list from: https://github.com/Marak/faker.js#localization`
            );
          }
          faker.locale = locale;
        }
      };

      this.data.addProcessor(config.prefix || "faker", (property) => {
        return states.get(property);
      });

      this.faker = states;
    },
    after: function () {
      const {result} = this.faker;
      if (result.length === 0) return;
      const msg = result.reduce((res, item) => {
        return `${res}\n  - ${item.property}: ${item.value}`;
      }, `During the scenario faker has generated ${result.length} values for you`);
      this.attach(msg);
    }
  }
};
