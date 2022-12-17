const CamelCase = require("lodash/camelCase");

module.exports = function (matchers = {}) {
  const {ids = []} = matchers;

  function parse(path) {
    const parameters = [];
    path = path
      .split("?")
      .shift()
      .split("/")
      .filter((_) => _)
      .reduce((res, item, i, arr) => {
        const isId = ids
          .map((regex) => {
            const validRegex = regex.match(/\/(.*)\/([dgimsuy]+)?$/);
            let opt = "";
            if (validRegex) {
              regex = validRegex[1];
              opt = validRegex[2];
            }
            return new RegExp(regex, opt);
          })
          .some((_) => _.test(item));
        if (isId && i !== 0) {
          const key = arr[i - 1].replace(/s$/, "") + "Id";
          item = "{" + key + "}";
          parameters.push(key);
        } else if (isId && i === 0) {
          parameters.push("id");
          item = "{id}";
        }

        return [res, item].join("/");
      }, "");

    if (path === "") {
      path = "/";
    }

    return {
      parameters,
      path
    };
  }

  function getOperation(path, method) {
    return CamelCase(method + path);
  }

  return {
    parse,
    getOperation
  };
};
