const Run = require("./run");
const path = require("path");

module.exports = async function () {
  const options = {
    args: [path.resolve(__dirname, "..", "..", "example")]
  };
  return Run(options);
};
