const expressHook = require("./express");
const fastifyHook = require("./fastify");

module.exports = {
  express: expressHook,
  fastify: fastifyHook
};
