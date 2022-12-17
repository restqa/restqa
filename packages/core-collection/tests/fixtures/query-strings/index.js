module.exports = {
  config: {
    projectName: "QUERY-STRING"
  },
  simulation: require("./simulation"),
  collections: {
    postman: require("./postman.json")
  }
};
