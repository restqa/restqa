const {GenericContainer, Wait} = require("testcontainers");
const {MongoClient, Timestamp} = require("mongodb");
const assert = require("assert");
const dot = require("dot-object");
const Debug = require("debug");

const DB_NAME = "restqa";
let container;
let mongodbUri;

module.exports = {
  name: "mongodb-mock",
  hooks: {
    beforeAll: async function (config = {}) {
      const {debug = false, mongodb = {}, envVarName = {}} = config;

      if (debug === true) {
        Debug.enable("testcontainers");
      }

      envVarName.uri = envVarName.uri || "MONGODB_URI";
      envVarName.dbName = envVarName.dbName || "MONGODB_DBNAME";

      console.log("> Spin up the mongodb container 👻 <"); // eslint-disable-line no-console
      // eslint-disable-next-line no-console
      console.log(
        "> ☝ Tips: You can tweak `BOOT_TIMEOUT` variable, if you need more timeout <"
      );

      container = await new GenericContainer(
        `mongo:${mongodb.version || "latest"}`
      )
        .withExposedPorts(27017)
        .withWaitStrategy(Wait.forLogMessage(/.*waiting for connections.*/i))
        .start();

      const host = container.getHost();
      const port = container.getMappedPort(27017);
      mongodbUri = `mongodb://${host}:${port}/`;

      this.restqa = this.restqa || {};
      this.restqa.mock = this.restqa.mock || {};
      const envs = {};
      envs[envVarName.uri] = mongodbUri;
      envs[envVarName.dbName] = DB_NAME;
      this.restqa.mock.envs = Object.assign(this.restqa.mock.envs || {}, envs);
    },
    before: async function (scenario) {
      const client = new MongoClient(mongodbUri);
      this["mongodb-mock"] = {
        client,
        db: await client.db(DB_NAME)
      };
      this.attach(
        `Connect to mongodb: ${mongodbUri} using the DB ${scenario.pickle.id}`
      );
    },
    after: async function (scenario) {
      await this["mongodb-mock"].db.dropDatabase();
      await this["mongodb-mock"].client.close();
    },
    afterAll: async function () {
      await container.stop();
    }
  },
  steps: {
    collectionExists: async function (name) {
      const collections = await this["mongodb-mock"].db
        .listCollections()
        .toArray();
      const collectionNames = collections.map((c) => c.name);
      assert.ok(
        collectionNames.includes(name),
        `The collection "${name}" does not exist in the DB`
      );
    },
    search: async function (collectionName, table) {
      const collection = this["mongodb-mock"].db.collection(collectionName);
      const fields = table.rawTable[0];
      const values = table.rawTable[1];
      const params = fields.reduce((result, item, index) => {
        result[item] = values[index];
        return result;
      }, {});
      const result = await collection.findOne(params);
      this["mongodb-mock"].search = {
        result,
        flatResult: dot.dot(result || {})
      };
      this.attach(JSON.stringify(result));
    },
    matchString: function (field, expectedValue) {
      const {flatResult} = this["mongodb-mock"].search;
      assert.equal(flatResult[field], expectedValue);
    },
    matchFloat: function (field, expectedValue) {
      const {flatResult} = this["mongodb-mock"].search;
      assert.equal(flatResult[field], expectedValue);
    },
    addEntries: async function (collectionName, table) {
      const collection = this["mongodb-mock"].db.collection(collectionName);
      const fields = table.rawTable.splice(0, 1).pop();
      const values = table.rawTable;
      const list = values.map((item, row) => {
        return fields.reduce((result, property, index) => {
          let value = item[index];
          const hasCast = property.match(/\[(\w+)\]/);
          if (hasCast) {
            property = property.trim().replace(/\[\w+\]/, "");
            value = cast(value, hasCast[1]);
          }

          if (value === "null") {
            value = null;
          }

          // console.log(result)

          result[property] = value;
          this.data.set(`row.${row + 1}.${property}`, item[index]);
          return dot.object(result);
        }, {});
      });
      const {insertedIds} = await collection.insertMany(list);
      Object.entries(insertedIds).forEach(([key, value]) => {
        this.data.set(`row.${Number(key) + 1}._id`, value);
      });
      this.attach(JSON.stringify(insertedIds));
    }
  }
};

function cast(value, type) {
  switch (type.toLowerCase()) {
    case "string":
      value = String(value);
      break;
    case "boolean":
      value = value === "true";
      break;
    case "number":
      value = Number(value);
      break;
    case "date":
      value = new Date(value);
      break;
    case "timestamp":
      value = new Timestamp(Number(value));
      break;
  }
  return value;
}
