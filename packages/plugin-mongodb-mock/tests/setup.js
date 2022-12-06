const cucumber = require("@cucumber/cucumber");
const RestQAMongoDbMock = require("../src/index");

const config = {
  debug: false,
  mongodb: {
    version: "latest"
  }
};

class World {
  constructor({attach}) {
    this.attach = attach;
  }

  getConfig() {
    return config;
  }
}

RestQAMongoDbMock._commit(cucumber, config);

cucumber.setDefaultTimeout(10000);
cucumber.setWorldConstructor(World);
