const express = require("express");
const {MongoClient} = require("mongodb");

const {PORT, MONGODB_URI, MONGODB_DBNAME} = process.env;

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  return client.db(MONGODB_DBNAME);
}

main()
  .then((db) => {
    express()
      .use(express.json())
      .get("/users/:id", async (req, res) => {
        const search = {
          "line.id": req.params.id
        };
        const result = await db.collection("users").findOne(search);
        delete result._id;
        res.json(result);
      })
      .post("/users", async (req, res) => {
        await db.collection("users").insertOne(req.body);
        res.sendStatus(201); // @todo: to be remove when this issue will be solved: https://github.com/restqa/restqa/issues/303
      })
      .listen(PORT || 3011);
  })
  .catch((error) => console.error(error)); // eslint-disable-line no-console
