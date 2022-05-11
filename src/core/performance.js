const path = require("path");
const fs = require("fs");
const YAML = require("yaml");

function Performance(config = {}) {
  if (["artillery"].includes(config.tool) === false) {
    throw new Error(
      'The performance property "tool" should be specify. (available: artillery)'
    );
  }

  const features = {};
  const add = (apis, scenario) => {
    if (apis.length === 0) return false;
    if (
      scenario.result.status.toLowerCase() !== "passed" &&
      config.onlySuccess === true
    )
      return false;

    const filename = path.basename(scenario.pickle.uri, ".feature") + ".yml";
    features[filename] = features[filename] || [];
    features[filename].push({apis, scenario});
    return true;
  };

  const generate = () => {
    const files = [];
    if (fs.existsSync(config.outputFolder) === false) {
      fs.mkdirSync(config.outputFolder, {recursive: true});
    }
    for (const name in features) {
      const content = {
        scenarios: features[name].reduce((output, item) => {
          const scenario = {
            name: item.scenario.pickle.name,
            flow: item.apis.map((api) => {
              const options = api.request.getOptions();
              const obj = {
                url: options.pathname,
                headers: clean(options.headers)
              };

              if (options.searchParams) {
                obj.qs = clean(options.searchParams);
              }

              if (options.json) {
                obj.json = clean(options.json);
              }

              if (options.body) {
                obj.formData = clean(api.request.bodyBackup);
              }

              obj.expect = [
                {
                  statusCode: api.response.statusCode
                },
                {
                  contentType: getContentType(
                    api.response.headers["content-type"]
                  )
                }
              ];
              const result = {};
              result[(options.method || "get").toLowerCase()] = obj;
              return result;
            })
          };
          output.push(scenario);
          return output;
        }, [])
      };
      const filename = path.resolve(config.outputFolder, name);
      fs.writeFileSync(filename, YAML.stringify(content));
      files.push(filename);
    }
    return files;
  };

  return {
    features,
    add,
    generate
  };
}

function clean(obj) {
  return Object.keys(obj).reduce((result, key) => {
    if (obj[key] !== undefined) result[key] = obj[key];
    return result;
  }, {});
}

function getContentType(headerContentType) {
  return String(headerContentType.split("/").pop()).split(";").shift();
}

module.exports = Performance;
