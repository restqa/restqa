const faker = require("faker");

module.exports = {
  name: "faker",
  hooks: {
    before: function () {
      const {locale = "en"} = this.getConfig("faker") || {};

      faker.locale = locale;

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

      this.data.addProcessor("faker", (property) => {
        const result = states.get(property);
        this.attach(
          `The property "${property}" has been replaced by "${result}"`
        );
        return result;
      });

      this.faker = states;
    }
  }
};
