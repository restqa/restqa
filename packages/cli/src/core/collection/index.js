const fs = require("fs");
const path = require("path");

module.exports = function (projectName, config) {
  const items = {};
  let host = "";

  function add(apis, scenario) {
    if (!Array.isArray(apis) || apis.length === 0) return;
    const {request} = apis[apis.length - 1];
    const options = request.getOptions();
    const {name} = scenario.gherkinDocument.feature;
    items[name] = items[name] || [];
    const item = {
      name: scenario.pickle.name,
      request: {
        method: options.method || "GET",
        url: {
          protocol: "http",
          host: ["{{host}}"],
          path: options.pathname.split("/").filter((_) => _)
        }
      },
      response: []
    };

    if (options.searchParams) {
      item.request.url.query = Object.entries(options.searchParams).map(
        ([key, value]) => {
          return {
            key,
            value
          };
        }
      );
    }

    if (options.auth) {
      item.request.header = item.request.header || [];
      item.request.header.push({
        key: "Authorization",
        value: "Bearer " + options.auth.bearer,
        type: "text"
      });
    }

    if (options.json) {
      item.request.header = item.request.header || [];
      item.request.header.push({
        key: "Content-Type",
        value: "application/json",
        type: "text"
      });
      item.request.body = {
        mode: "raw",
        raw: JSON.stringify(options.json)
      };
    }

    host = options.protocol + "//" + options.hostname;
    if (options.port) {
      host += ":" + options.port;
    }
    items[name].push(item);
  }

  function generate() {
    const name = projectName.toLowerCase();
    const outputFolder =
      config.getExportFile() ||
      path.resolve(process.cwd(), "tests", "collections");
    if (fs.existsSync(outputFolder) === false) {
      fs.mkdirSync(outputFolder, {recursive: true});
    }

    const result = {
      info: {
        name,
        schema:
          "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      item: Object.entries(items).map(([name, item]) => {
        return {
          name,
          item
        };
      }),
      variable: [
        {
          key: "host",
          value: host
        }
      ]
    };

    const filename = path.resolve(
      outputFolder,
      `${name}.postman_collection.json`
    );
    fs.writeFileSync(filename, JSON.stringify(result));
    return {
      postman: filename,
      insomnia: null,
      hoppscotch: null
    };
  }

  return {
    add,
    generate
  };
};
