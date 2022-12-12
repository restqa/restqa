const RestQAPlugin = require("@restqa/plugin");
const RestQAHTTPMock = require("./http-mock/index.cjs");

const instance = new RestQAPlugin(RestQAHTTPMock.name);
instance
  .addBeforeAllHook(
    {timeout: Number(process.env.BOOT_TIMEOUT) || 120000},
    function () {
      const config = instance._config;
      return RestQAHTTPMock.hooks.beforeAll.call(this, config);
    }
  )
  .addBeforeHook(RestQAHTTPMock.hooks.before)
  .addAfterAllHook(RestQAHTTPMock.hooks.afterAll);

module.exports = instance;
