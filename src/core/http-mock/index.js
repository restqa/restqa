const YAML = require("yaml");
const fs = require("fs");
const path = require("path");

module.exports = function ({outputFolder}) {
  const items = {};

  function add(apis, scenario) {
    if (!Array.isArray(apis) || apis.length === 0) return;
    const {request, response} = apis[apis.length - 1];
    const options = request.getOptions();
    const {uri} = scenario.pickle;
    items[uri] = items[uri] || [];
    const item = {
      request: {
        url: options.pathname,
        method: options.method || "GET"
      },
      response: {
        status: response.statusCode,
        headers: {
          "content-type": response.headers["content-type"]
        },
        body: JSON.stringify(response.body)
      }
    };
    if (options.searchParams) {
      item.request.query = options.searchParams;
    }

    if (options.auth) {
      item.request.headers = item.request.headers || {};
      item.request.headers.authorization = "Bearer " + options.auth.bearer;
    }

    if (options.json) {
      item.request.headers = item.request.headers || {};
      item.request.headers["content-type"] = "application/json";
      item.request.payload = JSON.stringify(options.json);
    }

    items[uri].push(item);
  }

  function generate() {
    let result;
    if (fs.existsSync(outputFolder) === false) {
      fs.mkdirSync(outputFolder, {recursive: true});
    }

    const files = Object.entries(items)
      .map(([file, list]) => {
        return list.map((content, index) => {
          file = file.split("/").pop();
          const filename = path.resolve(
            outputFolder,
            `${file + (index + 1)}.mock.yml`
          );
          const yamlContent = YAML.stringify(content);
          fs.writeFileSync(filename, yamlContent);
          return filename;
        });
      })
      .flat();

    if (files.length) {
      result = {
        outputFolder,
        files
      };
    }
    return result;
  }

  return {
    add,
    generate
  };
};
