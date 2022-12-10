const fastify = require("fastify");
const fs = require("fs");
const path = require("path");
const assert = require("assert");
const Express = require("express");

const Steps = function ({Given, When, Then}) {
  Given(
    "the upstream path {string} {string} should respond:",
    function (method, url, response) {
      if (process.platform !== "win32" && process.version.includes("v16")) {
        const err =
          "The tests are super slow on Node 16.... Save yourself some time! Upgrade to Node18";
        console.log(err); // eslint-disable-line no-console
        this.upstream = getServerNode16(method, url, response);
      } else {
        this.upstream = getServer(method, url, response);
      }
    }
  );

  When("upstream starts on port {int}", function (port, cb) {
    this.upstream.start(port, cb);
  });

  When("upstream stops", function (cb) {
    this.upstream.close(cb);
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

function getServerNode16(method, url, response) {
  const handler = function (req, res) {
    try {
      response = JSON.parse(response);
      return res.json(response);
    } catch (e) {
      return res.send(response);
    }
  };

  let srv;
  const app = Express();
  app[method.toLowerCase()](url, handler);

  function start(port, cb) {
    srv = app.listen(port, cb);
  }

  function close(cb) {
    srv.close(cb);
  }

  return {
    start,
    close
  };
}

function getServer(method, url, response) {
  const srv = fastify({logger: false});

  srv.route({
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

  function start(port, cb) {
    srv.listen({port}, cb);
  }

  function close(cb) {
    srv.close(cb);
  }

  return {
    start,
    close
  };
}

module.exports = Steps;
