const {URL} = require("url");

let host = null;
module.exports = function (projectName, features) {
  return {
    info: {
      name: projectName,
      schema:
        "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: transformFeatures(features),
    variable: [
      {
        key: "host",
        value: host
      }
    ]
  };
};

function transformFeatures(features) {
  return Object.entries(features).map(([name, feature]) => {
    return {
      name,
      item: feature.map(({options, scenario}) => {
        let variableProtocol = "http";
        let variableHost = "{{host}}";

        if (options.baseUrl) {
          const url = new URL(options.baseUrl);
          variableProtocol = url.protocol.replace(":", "");
          variableHost = url.hostname;
        }

        const item = {
          name: scenario.pickle.name,
          request: {
            method: options.method || "GET",
            url: {
              protocol: variableProtocol,
              host: [variableHost],
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

        if (options.headers) {
          item.request.header = item.request.header || [];
          Object.entries(options.headers)
            .filter(([key, value]) => {
              return !["x-correlation-id", "user-agent"].includes(
                key.toLowerCase()
              );
            })
            .forEach(([key, value]) => {
              item.request.header.push({
                key,
                value,
                type: "text"
              });
            });
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

        if (options.body) {
          item.request.header = item.request.header || [];
          item.request.header.push({
            key: "Content-Type",
            value: "multipart/form-data",
            type: "text"
          });

          const formdata = options.body
            .getBuffer()
            .toString("utf-8")
            .split("\n")
            .reduce((result, item, index, arr) => {
              if (item.includes("form-data")) {
                result.push({
                  key: item.match(/name="(.*)"/)[1],
                  value: arr[index + 2].replace("\r", ""),
                  type: "text"
                });
              }
              return result;
            }, []);

          item.request.body = {
            mode: "formdata",
            formdata
          };
        }

        host = options.protocol + "//" + options.hostname;
        if (options.port) {
          host += ":" + options.port;
        }

        return item;
      })
    };
  });
}
