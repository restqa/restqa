const {default: fastify} = require("fastify");

const app = fastify();

app.get("/hello", () => ({value: "world"}));

app.listen(9999, () => {});

