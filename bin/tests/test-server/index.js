const {default: fastify} = require("fastify");

const app = fastify();

app.get("/hello", () => ({value: "world"}));

app.listen(9999, () => {
  forceClose();
});

// Hack: force close (due to bats cannot kill a subprocess)
function forceClose() {
  setTimeout(() => {
    app.close();
  }, 10000);
}