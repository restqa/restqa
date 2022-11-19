const CODES = require("./codes.json");
const {URLSearchParams} = require("url");
const _ = require("lodash");
const SwaggerUrl = require("./url");

let CONFIG;
let URL;
let TAGS;
let OPTIONS;
module.exports = function (config) {
  CONFIG = config;
  const options = config.specification || {};

  options.tool = options.tool || "swagger";
  if (["swagger"].includes(options.tool) === false) {
    throw new Error(
      'The specification property "tool" should be specify. (available: swagger)'
    );
  }
  TAGS = options.tags || {};
  URL = new SwaggerUrl(options.matches);
  options.excludes = options.excludes || {};
  options.excludes.paths = options.excludes.paths || [];
  options.excludes.queries = options.excludes.queries || [];
  options.headers = options.headers || {};
  options.headers.request = options.headers.request || [];
  options.headers.response = options.headers.response || [];
  OPTIONS = options;

  // const tmpl = fs.readFileSync(options.template).toString('utf-8')
  const apis = [];

  const add = function (api) {
    apis.push(api);
  };

  const format = function () {
    const path = {};
    const definitions = {};
    const result = apis.reduce(transform, {path, definitions});
    return toOpenAPI(result);
    // result = YAML.stringify(toOpenAPI(result), { defaultKeyType: 'PLAIN', defaultStringType : 'QUOTE_DOUBLE'})
    // return result
    // fs.writeFileSync(options.to, tmpl.replace('<DEFINITION>', result.trim()))
    // return options.to
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
      version: "0.0.1",
      title: CONFIG.metadata.name,
      description: OPTIONS.description || CONFIG.metadata.description
    },
    /*
    // Not sure if we need to add the server definition
    servers: [{
      url: 'http://localhost:8000',
      description: CONFIG.environment.name
    }],
    */
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
    if (OPTIONS.excludes.paths.includes(endpoint.getPath())) {
      return {path};
    }
    path[endpoint.getPath()] = path[endpoint.getPath()] || endpoint;
    path[endpoint.getPath()]
      .addMethod(new Method(api))
      .addResponse(new Response(api.response));
    if (String(api.response.statusCode)[0] === "2") {
      const qs = api.request.qs || {};
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
    if (_.isEmpty(request.json)) return;
    const rBody = new RequestBody(request);
    requestBody = _.merge(requestBody || {}, rBody.toJSON());
  }

  function toJSON() {
    const obj = {
      deprecated: false,
      operationId: operation,
      tags,
      // summary: '✅ - ' +scenario.pickle.name,
      summary: scenario.pickle.name,
      parameters: parameters
        .sort((a, b) => a.type.localeCompare(b.type))
        .map((_) => _.toJSON()),
      requestBody,
      responses: responses.reduce((res, item) => {
        res[item.code] = _.merge(res[item.code] || {}, item.toJSON());
        return res;
      }, {})
    };

    if (obj.parameters.length === 0) delete obj.parameters;
    if (obj.tags.length === 0) delete obj.tags;
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
    const contentType = responseType === "json" && "application/json";
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
          schema: "string",
          example
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

    if (_.isEmpty(obj.headers)) {
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
      const first = val[0] || "";
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
