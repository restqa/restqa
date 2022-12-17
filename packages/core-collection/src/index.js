const path = require("path");
const fs = require("fs");
const Vendors = require("./vendors");

class Collection {
  constructor(options = {}) {
    this._options = options;
    this._features = {};
  }

  add(apis, scenario) {
    if (apis.length === 0) return false;
    const {request} = apis[apis.length - 1];
    const {name} = scenario.gherkinDocument.feature;
    this.features[name] = this.features[name] || [];
    this.features[name].push({
      scenario,
      options: request.getOptions()
    });
  }

  generate() {
    return Object.keys(this.vendors)
      .map((name) => {
        return {
          name,
          content: this.getVendor(name)(this.projectName, this.features)
        };
      })
      .reduce((result, item) => {
        result[item.name] = this.writeFile(item);
        return result;
      }, {});
  }

  writeFile({name, content}) {
    const filename = `${this.projectName}.${name}_collection.json`;
    const pathname = path.resolve(this.outputFolder, filename);
    fs.writeFileSync(pathname, JSON.stringify(content));
    return pathname;
  }

  get projectName() {
    return this.options.projectName;
  }

  get features() {
    return this._features;
  }

  get vendors() {
    return Vendors;
  }

  getVendor(name) {
    return this.vendors[name];
  }

  get options() {
    return this._options;
  }

  get outputFolder() {
    const outputFolder = path.resolve(this.options.resultFolder, "collections");
    if (fs.existsSync(outputFolder) === false) {
      fs.mkdirSync(outputFolder, {recursive: true});
    }
    return outputFolder;
  }
}

module.exports = Collection;
