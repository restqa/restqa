const RestQAPlugin = require("@restqa/plugin");
const RestQAMongoDbMock = require("./mongodb-mock/index.cjs");

const instance = new RestQAPlugin(RestQAMongoDbMock.name);
instance
  .addBeforeAllHook(
    {timeout: Number(process.env.BOOT_TIMEOUT) || 120000},
    function () {
      const config = instance._config;
      return RestQAMongoDbMock.hooks.beforeAll.call(this, config);
    }
  )
  .addBeforeHook(RestQAMongoDbMock.hooks.before)
  .addAfterHook(RestQAMongoDbMock.hooks.after)
  .addAfterAllHook(RestQAMongoDbMock.hooks.afterAll)
  .addGivenStep(
    "a collection[mongodb] {string}:",
    RestQAMongoDbMock.steps.addEntries
  )
  .addThenStep(
    "the collection[mongodb] {string} exists",
    RestQAMongoDbMock.steps.collectionExists
  )
  .addThenStep(
    "search in collection[mongodb] {string}:",
    RestQAMongoDbMock.steps.search
  )
  .addThenStep(
    "search result {string} = {string}",
    RestQAMongoDbMock.steps.matchString
  )
  .addThenStep(
    "search result {string} = {int}",
    RestQAMongoDbMock.steps.matchFloat
  );

module.exports = instance;
