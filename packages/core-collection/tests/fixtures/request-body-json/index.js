module.exports = {
  config: {
    projectName: "REQUEST-BODY-JSON"
  },
  simulation: require("./simulation"),
  collections: {
    postman: require("./postman.json")
  }
};
