const {default: fastify} = require("fastify");

const app = fastify();

app.get("/hello", () => "world");

app.listen(9999);
