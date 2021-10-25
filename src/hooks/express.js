const path = require("path");

const Sandbox = require("../core/sandbox");
const HttpsServer = require("../http-server");

module.exports = function expressHook(server, options) {
  options = options || {};
  options.isHooked = true;
  options.route = options.route || "/restqa";
  options.sandbox = options.sandbox || new Sandbox();
  options.folder = options.folder || process.cwd();
  options.configFile =
    options.configFile || path.resolve(process.cwd(), ".restqa.yml");
  options.serve = false;
  server
    .use(options.route, HttpsServer(options.configFile, options))
    .use((req, res, next) => {
      const buffers = [];
      const proxyHandler = {
        apply(target, thisArg, argumentsList) {
          const contentType = res.getHeader("content-type");
          if (
            typeof contentType === "string" &&
            contentType.includes("json") &&
            argumentsList[0]
          ) {
            buffers.push(argumentsList[0]);
          }
          return target.call(thisArg, ...argumentsList);
        }
      };
      res.write = new Proxy(res.write, proxyHandler);
      res.end = new Proxy(res.end, proxyHandler);
      res.on("finish", function () {
        if (req.path.startsWith(options.route)) return;

        // tracing logic inside
        const response = {
          headers: this.getHeaders(),
          statusCode: this.statusCode,
          body: Buffer.concat(buffers).toString("utf-8")
        };

        delete response.headers.etag;

        if ((response.headers["content-type"] || "").includes("json")) {
          response.body = JSON.parse(response.body);
        }

        const request = {
          path: req.path,
          method: req.method,
          query: req.query,
          headers: req.headers,
          body: req.body
        };

        const msg = {
          request,
          response
        };
        options.sandbox.emit("request", msg);
      });
      next();
    });
  return server;
};
