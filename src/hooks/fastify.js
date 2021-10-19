// const path = require("path");
const fp = require("fastify-plugin");
// const fastifyExpress = require("fastify-express");

// const HttpsServer = require("../http-server");
const Sandbox = require("../core/sandbox");

// async function addRestQANamespace (fastify, options) {
//   const configFile = 
//         options.configFile ||
//         path.resolve(process.cwd(), "..", ".restqa.yml");

//   await fastify.register(fastifyExpress);
//   fastify.use(options.route, HttpsServer(configFile, {...options, server: fastify}));
// }

module.exports = fp(async (fastify, opts) => {
  const options = Object.assign({}, opts) || {}
  options.route = opts.route || "/restqa";
  options.sandbox = opts.sandbox || new Sandbox();
  options.folder = opts.folder || process.cwd();
  options.serve = false;

  // add dashboard
  // await fastify.register(addRestQANamespace, options);

  fastify.addHook("onSend", async function (request, reply, payload) {
    setImmediate(() => {
      if (request.url.startsWith(options.route)) return;
  
      // tracing logic inside
      const response = {
        headers: reply.getHeaders(),
        statusCode: reply.statusCode,
        body: payload
      };
  
      reply.removeHeader("etag");
  
      if ((response.headers["content-type"] || "").includes("json")) {
        response.body = JSON.parse(response.body);
      }
  
      const msg = {
        request: {
          path: request.url,
          method: request.method,
          query: request.query,
          headers: request.headers,
          body: request.body
        },
        response
      };
  
      options.sandbox.emit("request", msg);
    })
  });
}, { name: "restqa" });