const {URL} = require("url");
const API = require("./api");
const Response = require("./api/response");
const Steps = require("../steps");

module.exports = async function (transaction, includeHost) {
  let api;
  if (transaction && transaction.response) {
    api = getFromFull(transaction);
  } else {
    api = await getFromPartial(transaction);
  }

  const mapping = {
    request: {
      host: "",
      path: "",
      ssl: "",
      method: "",
      headers: [],
      query: [],
      body: null,
      form: []
    },
    action: "",
    response: {
      statusCode: 0,
      headers: [],
      body: null
    }
  };

  const options = api.request.getOptions();
  const {bodyBackup} = api.request;

  const Given = (definition, fn, description, tags) => {
    tags = tags.split(",").map((_) => _.trim());
    if (!tags.includes("generator")) return;

    if (api.type === "FULL" || includeHost === false) {
      if (tags.includes("gateway")) {
        mapping.request.host = definition;
      }
    } else if (api.type === "PARTIAL") {
      if (tags.includes("host")) {
        mapping.request.host = definition.replace(
          "{string}",
          `"${api.URL.origin}"`
        );
      }
    }

    if (tags.includes("ssl") && options.rejectUnauthorized === false) {
      mapping.request.ssl = definition;
    }

    if (tags.includes("basic auth") && transaction.user) {
      const _def = definition
        .replace("{string}", `"${transaction.user.username}"`)
        .replace("{string}", `"${transaction.user.password}"`)
        .replace("\\", "");
      mapping.request.headers.push(_def);
    }

    if (tags.includes("form") && bodyBackup) {
      const table = [definition];
      Object.entries(bodyBackup).forEach(([key, value]) => {
        const row = `    | ${key} | ${value} |`;
        table.push(row);
      });
      if (table.length === 1) return;
      mapping.request.form.push(table.join("\n"));
    }

    if (tags.includes("qs")) {
      const table = [definition];
      Object.entries(options.searchParams || {}).forEach(([key, value]) => {
        const row = `    | ${key} | ${value} |`;
        table.push(row);
      });
      if (table.length === 1) return;
      mapping.request.query.push(table.join("\n"));
    }

    if (tags.includes("headers") && options.headers) {
      const excludeHeaders = ["x-correlation-id", "user-agent"];
      const table = [definition];
      Object.entries(options.headers || {}).forEach(([key, value]) => {
        if (excludeHeaders.includes(key)) return;
        if (value.startsWith("Basic") && transaction.user) return;
        const row = `    | ${key} | ${value} |`;
        table.push(row);
      });
      if (table.length === 1) return;
      mapping.request.headers.push(table.join("\n"));
    }

    if (tags.includes("jsonbody") && options.json) {
      definition = `
${definition}
  """
${JSON.stringify(options.json, null, 2)}
  """
`;
      mapping.request.body = definition.trim();
    }
  };

  const When = (definition, fn, description, tags) => {
    if (!tags.includes("generator")) return;
    const {method, pathname} = options;
    if (definition.includes(method.toUpperCase()) && tags.includes("call")) {
      mapping.action = definition.replace("{string}", `"${pathname}"`);
    }
  };

  const Then = (definition, fn, description, tags) => {
    if (!tags.includes("generator")) return;
    if (tags.includes("status")) {
      mapping.response.statusCode = definition.replace(
        "{int}",
        api.response.statusCode
      );
    }

    if (tags.includes("jsonbody") && api.response.body) {
      definition = `
${definition}
  """
${JSON.stringify(api.response.body, null, 2)}
  """
`;
      mapping.response.body = definition.trim();
    }
  };

  Steps({Given, When, Then});

  const result = [];
  result.push(`Given ${mapping.request.host}`);
  if (mapping.request.ssl) {
    result.push(`  And ${mapping.request.ssl}`);
  }
  mapping.request.headers.forEach((step) => {
    result.push(`  And ${step}`);
  });
  mapping.request.query.forEach((step) => {
    result.push(`  And ${step}`);
  });
  mapping.request.form.forEach((step) => {
    result.push(`  And ${step}`);
  });
  if (mapping.request.body) {
    result.push(`  And ${mapping.request.body}`);
  }
  result.push(`When ${mapping.action}`);
  result.push(`Then ${mapping.response.statusCode}`);
  if (mapping.response.body) {
    result.push(`  And ${mapping.response.body}`);
  }

  return result.join("\n");
};

async function getFromPartial(options) {
  if (!options)
    throw new ReferenceError(
      "Please provide an object containing your request"
    );
  if (!options.url) throw new ReferenceError("Please specify your url");
  if (
    options.method &&
    !["GET", "POST", "PUT", "PATCH", "OPTIONS", "DELETE", "HEAD"].includes(
      options.method
    )
  )
    throw new TypeError(
      `The method "${options.method}" is not valid, please use : GET, POST, PUT, PATCH, DELETE, OPTIONS or HEAD`
    );

  options.method = options.method || "GET";

  const config = {
    url: options.url
  };

  const api = new API({config});
  api.type = "PARTIAL";
  api.request.setMethod(options.method);
  api.URL = new URL(options.url);
  api.URL.searchParams.forEach((value, key) => {
    api.request.setQueryString(key, value);
  });

  Object.keys(options.headers || {}).forEach((key) => {
    api.request.setHeader(key, options.headers[key]);
  });

  if (options.body) {
    api.request.setPayload(options.body);
  }

  if (options.ignoreSsl === true) {
    api.request.ignoreSsl();
  }

  if (options.user) {
    const encoded = Buffer.from(
      options.user.username + ":" + options.user.password,
      "utf8"
    ).toString("base64");
    api.request.setHeader("authorization", `Basic ${encoded}`);
  }

  Object.keys(options.form || {}).forEach((key) => {
    api.request.addFormField(key, options.form[key]);
  });

  await api.run();
  return api;
}

function getFromFull(options) {
  const {request, response} = options;
  const config = {
    url: "http://dummy.com"
  };
  const api = new API({config});
  api.type = "FULL";
  api.request.setMethod(request.method);
  api.request.setPath(request.path);
  Object.entries(request.query || {}).forEach(([key, value]) => {
    api.request.setQueryString(key, value);
  });
  Object.keys(request.headers || {}).forEach((key) => {
    api.request.setHeader(key, request.headers[key]);
  });

  if (request.json) {
    api.request.setPayload(request.json);
  }

  if (typeof response.body !== "string") {
    response.body = JSON.stringify(response.body);
  }
  api.response = new Response(response);
  return api;
}
