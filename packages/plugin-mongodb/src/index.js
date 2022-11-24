const RestQAPlugin = require("@restqa/plugin");
const RestQAMongoDbMock = require("./mongodb-mock");

const instance = new RestQAPlugin(RestQAMongoDbMock.name);
instance
  .addBeforeAllHook({timeout: process.env.BOOT_TIMEOUT || 30000}, function () {
    const config = instance._config;
    return RestQAMongoDbMock.hooks.beforeAll.call(this, config);
  })
  .addBeforeHook(RestQAMongoDbMock.hooks.before)
  .addAfterHook(RestQAMongoDbMock.hooks.after)
  .addAfterAllHook(RestQAMongoDbMock.hooks.afterAll)
  .addGivenStep(
    "I insert in the collection {string}:",
    RestQAMongoDbMock.steps.addEntries
  )
  .addThenStep(
    "the db collection {string} exists",
    RestQAMongoDbMock.steps.collectionExists
  )
  .addThenStep(
    "I search in the collection {string}:",
    RestQAMongoDbMock.steps.search
  )
  .addThenStep(
    "the result of the search at {string} should equal {string}",
    RestQAMongoDbMock.steps.matchString
  )
  .addThenStep(
    "the result of the search at {string} should equal {int}",
    RestQAMongoDbMock.steps.matchFloat
  );

module.exports = instance;
