module.exports = {
  config: {
    projectName: "BASE-URL"
  },
  simulation: require("./simulation"),
  collections: {
    postman: require("./postman.json"),
    insomnia: require("./insomnia.json")
  }
};
