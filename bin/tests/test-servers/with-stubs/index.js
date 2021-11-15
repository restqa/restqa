const {default: fastify} = require("fastify");
const got = require('got')

const app = fastify();

app.get("/status", async () => {
  const url = process.env.GITHUB_API || 'https://api.github.com'
  const { body } = await got.get(url + '/status', { responseType: 'json'})
  return body
});

app.listen(9999, () => {});

