const CODES = require("./codes.json");
const {URLSearchParams} = require("url");
const isEmpty = require("lodash/isEmpty");
const Merge = require("lodash/merge");
const SwaggerUrl = require("./url");

let URL;
let TAGS;
let OPTIONS;
module.exports = function (options) {
  TAGS = options.tags || {};
  URL = new SwaggerUrl(options.matches || {});
  options.excludes = options.excludes || {};
  options.excludes.routes = options.excludes.routes || [];
  options.excludes.queries = options.excludes.queries || [];
  options.headers = options.headers || {};
  options.headers.request = options.headers.request || [];
  options.headers.response = options.headers.response || [];
  OPTIONS = options;

  const apis = [];

  const add = function (api) {
    api = prepareAPI({
      request: api.request.getOptions(),
      response: api.response.getOptions(),
      scenario: api.scenario
    });
    apis.push(api);
  };

  const format = function () {
    const path = {};
    const definitions = {};
    const result = apis.reduce(transform, {path, definitions});
    return toOpenAPI(result);
  };

  return {
    add,
    format
  };
};

function toOpenAPI({path, definitions}) {
  const obj = {
    openapi: "3.0.0",
    info: {
      version: OPTIONS.info.version,
      title: OPTIONS.info.title,
      description: OPTIONS.info.description
    },
    paths: {}
  };

  for (const [pathname, endpoint] of Object.entries(path)) {
    obj.paths[pathname] = endpoint.toJSON();
  }

  return obj;
}

function transform(result, api) {
  const {path} = result;
  try {
    const endpoint = new Endpoint(api);
    const isExclude = OPTIONS.excludes.routes.some((item) => {
      return (
        endpoint.getPath() === item.path &&
        api.request.method === item.method.toLowerCase()
      );
    });
    if (isExclude) {
      return {path};
    }

    path[endpoint.getPath()] = path[endpoint.getPath()] || endpoint;
    path[endpoint.getPath()]
      .addMethod(new Method(api))
      .addResponse(new Response(api.response));
    if (String(api.response.statusCode)[0] === "2") {
      const qs = api.request.searchParams || {};
      const extraParameter = api.request.pathname.split("?");
      if (extraParameter.length > 1) {
        const sp = new URLSearchParams(extraParameter.pop());
        Array.from(sp.entries()).reduce((res, [key, val]) => {
          res[key] = val;
          return res;
        }, qs);
      }
      for (const [key, example] of Object.entries(qs)) {
        path[endpoint.getPath()]
          .getMethod(api.request.method)
          .setParameters(key, "query", example);
      }

      for (const [key, example] of Object.entries(api.request.headers || {})) {
        path[endpoint.getPath()]
          .getMethod(api.request.method)
          .setParameters(key, "header", example);
      }

      path[endpoint.getPath()]
        .getMethod(api.request.method)
        .setRequestBody(api.request);
    }
  } catch (e) {
    // console.log('oups', e.message)
    // console.log(e)
    // console.log(api)
  }
  return {path};
}

function Endpoint(api) {
  const methods = {};
  const swag = URL.parse(api.request.pathname);
  function getPath() {
    return swag.path;
  }

  function addMethod(method) {
    methods[method.name] = methods[method.name] || method;
    methods[method.name].setOperation(URL.getOperation(swag.path, method.name));
    methods[method.name].setTags(getTags(swag.path));
    swag.parameters.forEach((name) =>
      methods[method.name].setParameters(name, "path")
    );
    return methods[method.name];
  }

  function getMethod(method) {
    return methods[method];
  }

  return {
    getPath,
    addMethod,
    getMethod,
    toJSON: () => {
      return Object.keys(methods).reduce((res, item) => {
        res[item] = methods[item].toJSON();
        return res;
      }, {});
    }
  };
}

function Method({scenario, request, response}) {
  const responses = [];
  let operation;
  const parameters = [];
  let tags = [];
  let requestBody;

  function addResponse(response) {
    responses.push(response);
    return response;
  }

  function setOperation(val) {
    operation = val;
  }

  function setTags(val) {
    tags = val;
  }

  function setParameters(name, type, example) {
    const el = parameters.find((_) => _.name === name);
    if (type === "query" && OPTIONS.excludes.queries.includes(name)) return;
    if (type === "header" && !OPTIONS.headers.request.includes(name)) return;
    if (!el) {
      parameters.push(new RequestParameter(name, type, example));
    }
  }

  function setRequestBody(request) {
    if (isEmpty(request.json)) return;
    const rBody = new RequestBody(request);
    requestBody = Merge(requestBody || {}, rBody.toJSON());
  }

  function toJSON() {
    const obj = {
      operationId: operation,
      tags,
      summary: scenario.name,
      parameters: parameters
        .sort((a, b) => a.type.localeCompare(b.type))
        .map((_) => _.toJSON()),
      requestBody,
      responses: responses.reduce((res, item) => {
        res[item.code] = Merge(res[item.code] || {}, item.toJSON());
        return res;
      }, {})
    };

    if (obj.tags.length === 0) {
      obj.tags = ["Tested by RestQA"];
    }

    if (obj.parameters.length === 0) delete obj.parameters;
    if (!obj.requestBody) delete obj.requestBody;
    return obj;
  }

  return {
    name: request.method,
    addResponse,
    setOperation,
    setParameters,
    setRequestBody,
    setTags,
    toJSON
  };
}

function RequestParameter(name, type, example) {
  function toJSON() {
    const obj = {
      name,
      in: type,
      required: type === "path",
      schema: {
        type: "string"
      }
    };
    if (example) obj.schema.example = example;
    return obj;
  }

  return {
    name,
    type,
    toJSON
  };
}

function RequestBody({body, responseType, json, headers}) {
  function toJSON() {
    const contentType = "application/json";
    const content = {};
    content[contentType] = {
      schema: new Schema(contentType, json).toJSON()
    };

    return {
      content
    };
  }

  return {
    toJSON
  };
}

function Response({statusCode, body, headers}) {
  function toJSON() {
    const contentType = (headers["content-type"] || "").split(";").shift();
    if (!contentType) {
      return {
        description: CODES[statusCode]
      };
    }

    const content = {};
    content[contentType] = {
      schema: new Schema(contentType, body).toJSON()
    };

    const _headers = {};
    for (const [key, example] of Object.entries(headers)) {
      if (OPTIONS.headers.response.includes(key)) {
        _headers[key] = {
          schema: {
            type: "string",
            example
          }
        };
      }
    }

    content[contentType] = {
      schema: new Schema(contentType, body).toJSON()
    };

    const obj = {
      description: CODES[statusCode],
      headers: _headers,
      content
    };

    if (isEmpty(obj.headers)) {
      delete obj.headers;
    }

    return obj;
  }

  return {
    code: statusCode,
    toJSON
  };
}

function Schema(type, body) {
  const getDefinition = function (obj) {
    const properties = {};
    for (let [key, val] of Object.entries(obj || {})) {
      let type = getType(val);
      const first = (val || "")[0] || "";
      switch (type) {
        case "object":
          properties[key] = {
            type: "object",
            properties: getDefinition(val)
          };
          break;
        case "array":
          properties[key] = {
            type: "array"
          };
          if (getType(first) === "object") {
            properties[key].items = {
              type: "object",
              properties: getDefinition(first)
            };
          } else {
            properties[key].items = {
              type: getType(first),
              example: first
            };
          }
          break;
        default:
          if (type === "string" && val.length > 500) {
            val = val.substr(0, 500) + "...";
          }
          if (type === "null") type = "string";
          properties[key] = {
            type,
            example: val
          };
          break;
      }
    }
    return properties;
  };

  function toJSON() {
    const type = getType(body);
    const obj = {
      type
    };
    if (type === "object") {
      obj.properties = getDefinition(body);
    }

    if (type === "array") {
      obj.items = {
        type: "object",
        properties: getDefinition(body[0])
      };
    }

    if (type === "string") {
      obj.example = body;
    }
    return obj;
  }

  return {
    toJSON
  };
}

function getTags(path) {
  const result = [];
  for (const [tag, operations] of Object.entries(TAGS)) {
    if (operations.includes(path)) {
      result.push(tag);
    }
  }
  return result;
}

const getType = function (obj) {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
};

function prepareAPI(api) {
  api.request.method = api.request.method.toLowerCase();
  return api;
}
