const path = require("path");
const Vendors = require("./vendors");

class Performance {
  constructor(options = {}) {
    this._options = options;
    if (this.vendor === undefined) {
      throw new Error(
        `The performance property "tool" should be specify. (available: ${Object.keys(
          Vendors
        ).join(", ")})`
      );
    }

    this._features = {};
  }

  add(apis, scenario) {
    if (apis.length === 0) return false;
    if (
      scenario.result.status.toLowerCase() !== "passed" &&
      this.options.onlySuccess === true
    ) {
      return false;
    }

    const filename = path.basename(scenario.pickle.uri, ".feature") + ".yml";
    this.features[filename] = this.features[filename] || [];
    this.features[filename].push({apis, scenario});
    return true;
  }

  generate() {
    return this.vendor(this.features, this.options.outputFolder);
  }

  get features() {
    return this._features;
  }

  get vendor() {
    return Vendors[this.options.tool];
  }

  get options() {
    return this._options;
  }
}

module.exports = Performance;
