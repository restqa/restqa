const cucumber = require("@cucumber/cucumber");
const RestQAHTTPMock = require("../src/index");
const got = require("got");
const path = require("path");
const {match, deepStrictEqual} = require("assert");
const {fork} = require("child_process");
const getPort = require("get-port");

const config = {
  folder: path.resolve(__dirname, "./stubs"),
  debug: false,
  envs: {
    GITHUB_API: "github"
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

RestQAHTTPMock.addBeforeAllHook(function () {
  match(this.restqa.mock.envs.GITHUB_API, /http:\/\/localhost:\d+\/github/);
})
  .addGivenStep("I start a server", async function () {
    const {envs} = this["http-mock"];
    const PORT = await getPort();
    this.host = `http://localhost:${PORT}`;
    this.cp = fork(path.join(__dirname, "server.js"), {
      silent: !config.debug,
      env: {
        ...process.env,
        ...envs,
        PORT
      }
    });
    match(envs.GITHUB_API, /http:\/\/localhost:\d+\/github/);
  })
  .addWhenStep("I GET {string}", async function (path) {
    const url = this.host + path;
    const {body, statusCode} = await got.get(url, {
      responseType: "json",
      throwHttpErrors: false
    });
    this.body = body;
    this.statusCode = statusCode;
  })
  .addThenStep("the status code should be {int}", function (status) {
    deepStrictEqual(this.statusCode, status);
  })
  .addThenStep("the response body should be:", function (body) {
    deepStrictEqual(body, body);
  })
  .addAfterHook(function () {
    this.cp && this.cp.kill("SIGKILL");
  })
  ._commit(cucumber, config);

cucumber.setDefaultTimeout(10000);
cucumber.setWorldConstructor(World);
