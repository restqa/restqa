const fastify = require("fastify");
const fastifyProxy = require("@fastify/http-proxy");
const Transaction = require("./transaction");
const chalk = require("chalk");

module.exports = function (options) {
  const app = fastify({logger: options.logger});
  app.register(fastifyProxy, {
    upstream: options.upstream,
    proxyPayloads: false,
    replyOptions: {
      onResponse(request, reply, res) {
        const transaction = new Transaction(request, reply);

        res.on("data", (data) => transaction.onData(data));
        res.on("end", () => {
          transaction.onEnd();
          options.event.emit("transaction", transaction);
        });
        reply.send(res);
      }
    }
  });
  app.listen({port: options.port}).then(() => {
    const logs = [
      `> ${chalk.blue("The Sandbox is ready 🦏")}`,
      `> Generate test scenario just by sending API request to: ${chalk.green(
        "http://localhost:" + options.port
      )}`,
      `> Example: ${chalk.yellow(
        "curl -X GET http://localhost:" + options.port
      )}`,
      `> Example to save scenario in file: ${chalk.yellow(
        'curl -X GET -H "x-restqa-scenario: name of my scenario" http://localhost:' +
          options.port
      )}`,
      "--",
      `> To exit, press ${chalk.red("Ctrl+C")}`,
      `\n`
    ];
    options.stream.write(logs.join("\n"));
  });
};
