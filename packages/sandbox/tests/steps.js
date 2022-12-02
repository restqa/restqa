const fastify = require("fastify");
const fs = require("fs");
const path = require("path");
const assert = require("assert");
const http = require("http");

const Steps = function ({Given, When, Then}) {
  Given(
    "the upstream path {string} {string} should respond:",
    function (method, url, response) {
      if (process.platform !== "win32" && process.version.includes("v16")) {
        console.log(
          "The tests are super slow on Node 16.... Save yourself some time! Upgrade to Node18"
        );
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
    res.writeHead(200);
    try {
      response = JSON.stringify(JSON.parse(response));
      res.setHeader("Content-Type", "application/json");
    } catch (e) {}
    return res.end(response);
  };

  const srv = http.createServer(handler);

  function start(port, cb) {
    srv.listen(port, cb);
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
