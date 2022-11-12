const {Api} = require("./lib");

module.exports = {
  name: "rest-api",
  steps: {
    given: require("./steps/1-given"),
    when: require("./steps/2-when"),
    then: require("./steps/3-then")
  },
  hooks: {
    before: function (scenario) {
      this.apis = [];
      this.createApi = (url) => {
        const options = {
          config: this.getConfig("rest-api")
        };

        if (url) {
          options.config.url = url;
        }

        const api = new Api(options);
        this.apis.push(api);
        return api;
      };

      if (scenario.pickle.tags.find((_) => _.name === "@insecure")) {
        this.insecure = true;
      }
    },
    after: function (scenario) {
      if (this.debug && this.debug.length) {
        this.log(
          `\n======================== [ DEBUG : ${scenario.pickle.name} ] ========================`
        );
        this.debug.forEach((item) => {
          if (typeof item === "object") item = JSON.stringify(item, null, 2);
          this.log(item);
        });
        this.log(
          "======================== [ / DEBUG ] ========================"
        );
      }
      const attachements = {
        apis: this.apis.map((_) => _.toJSON())
      };
      this.attach(JSON.stringify(attachements), "application/json");
    }
  },
  generator: require("./lib/generator")
};
