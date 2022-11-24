const DEBUG = require("debug");
const path = require("path");
const {GenericContainer, Wait} = require("testcontainers");
const PORT = 8882;

let container;

module.exports = {
  name: "http-mock",
  hooks: {
    beforeAll: async function (config) {
      const {envs = {}, debug = false, folder} = config;

      try {
        if (debug === true) {
          DEBUG.enable("testcontainers:containers");
        }

        container = await new GenericContainer(`restqa/stubby`)
          .withExposedPorts(PORT)
          .withEnvironment({
            STUB_VARS: JSON.stringify(envs)
          })
          .withBindMounts([
            {
              source: path.resolve(folder),
              target: "/stubby/data",
              mode: "ro"
            }
          ])
          .withWaitStrategy(Wait.forLogMessage(/.*Stubs portal running */i))
          .start();

        const host = getHost(container);

        console.log(
          // eslint-disable-line no-console
          `> Spin up the http-mock-server on the port ${container.getMappedPort(
            PORT
          )} 👻 <`
        );

        this.restqa = this.restqa || {};
        this.restqa.mock = this.restqa.mock || {};
        this.restqa.mock.envs = Object.assign(
          this.restqa.mock.envs || {},
          getMock(host, envs)
        );
      } catch (e) {
        console.log(e); // eslint-disable-line no-console
      }
    },
    before: function () {
      const {envs} = this.getConfig("http-mock");
      const host = getHost(container);
      this["http-mock"] = {
        envs: getMock(host, envs)
      };
    },
    afterAll: async function () {
      if (container) {
        await container.stop();
      }
    }
  }
};

function getMock(host, envs) {
  const result = {};
  for (const [key, value] of Object.entries(envs)) {
    result[key] = `${host}/${value}`;
  }
  return result;
}

process.on("exit", async () => {
  if (container) {
    await container.stop();
  }
});

function getHost(container) {
  const port = container.getMappedPort(PORT);
  return `http://${container.getHost()}:${port}`;
}
