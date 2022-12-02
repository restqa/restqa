const fastify = require("fastify");
const fs = require("fs");
const path = require("path");
const assert = require("assert");

const Steps = function ({Given, When, Then}) {
  Given(
    "the upstream path {string} {string} should respond:",
    function (method, url, response) {
      const app = fastify({logger: false});
      app.route({
        method,
        url,
        handler: function (request, reply) {
          try {
            const res = JSON.parse(response);
            reply.send(res);
          } catch (e) {}
          reply.send(response);
        }
      });

      this.upstream = app;
    }
  );

  When("upstream starts on port {int}", async function (port) {
    return this.upstream.listen({port});
  });

  When("upstream stops", function (cb) {
    try {
      this.upstream.close((err) => {
        console.log("closing the server");
        cb(err);
      });
    } catch (e) {
      console.log(e);
      cb();
    }
  });

  Then("the file {string} exists", function (file) {
    const filename = path.resolve(process.cwd(), file);
    assert.ok(fs.existsSync(filename));
  });

  Then("the file {string} not exists", function (file) {
    const filename = path.resolve(process.cwd(), file);
    assert.ok(fs.existsSync(filename) === false);
  });

  Then("the file {string} content matchs:", function (file, expectedContent) {
    const filename = path.resolve(process.cwd(), file);
    const content = fs.readFileSync(filename).toString("utf-8").trim();
    expectedContent = expectedContent.trim();
    assert.equal(content, expectedContent);
  });

  Then("the console print:", function (expectedContent) {
    const filename = path.resolve(
      process.cwd(),
      "tests-generated",
      "local",
      "tmp.console"
    );
    const content = fs.readFileSync(filename).toString();

    expectedContent = expectedContent.trim();
    assert.ok(content.includes(expectedContent), expectedContent);
  });
};

module.exports = Steps;
