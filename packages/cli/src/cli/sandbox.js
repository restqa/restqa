const Sandbox = require("@restqa/sandbox");
const Global = require("../core/global");
const {cwd} = require("../utils/process");
const path = require("path");
const Executor = require("../core/executor");

module.exports = async function ({port, debug}) {
  const configFile = path.resolve(cwd, ".restqa.yml");
  global.restqa = new Global({configFile});

  const options = {
    port: global.restqa.config.getLocalTest().getPort(),
    command: global.restqa.config.getLocalTest().getCommand()
  };

  const upstream = `http://localhost:${options.port}`;
  const microservice = new Executor(options);
  await microservice.execute();

  return Sandbox({
    port,
    upstream,
    debug,
    stream: global.restqa.outputStream
  });
};
