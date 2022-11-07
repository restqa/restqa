import fastify from 'fastify'
import axios from 'axios'

const app = fastify();

app.get("/status", async () => {
  const host = process.env.GITHUB_API || 'https://api.github.com'
  const url = host + '/status'
  let response = {}
  try {
    response = await axios.get(url, { responseType: 'json'})
  } catch(e) {
    console.log(e)
  }
  return response.data
});

app.listen(9999, () => {});

