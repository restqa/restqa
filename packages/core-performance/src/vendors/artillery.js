const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const {clean, getContentType} = require("../utils/api");

module.exports = function (features, outputFolder) {
  const files = [];
  if (fs.existsSync(outputFolder) === false) {
    fs.mkdirSync(outputFolder, {recursive: true});
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
    const filename = path.resolve(outputFolder, name);
    fs.writeFileSync(filename, YAML.stringify(content));
    files.push(filename);
  }
  return files;
};
