const dot = require("dot-object");
const jp = require("jsonpath");

const Response = function (result) {
  let {request, statusCode, statusMessage, headers = {}, body, timing} = result;

  const isJson = /application\/json/i.test(headers["content-type"] || "");

  if (body === statusMessage) {
    body = undefined;
  }

  if (isJson && body) {
    body = JSON.parse(body);
  }

  let dotBody = {};

  if (isJson) {
    dotBody = dot.dot(body || {});
  }

  const findInBody = (property) => {
    if (property.charAt(0) === "$") {
      // if $ is the first char we will use jsonpath
      return jp.query(body || {}, property, 1)[0];
    } else {
      // Otherwise we use simple dotObject
      return dotBody[property];
    }
  };

  const findInHeader = (property) => {
    return headers[property] || headers[property.toLowerCase()];
  };

  const getOptions = () => {
    return {
      statusCode,
      headers,
      timing,
      body
    };
  };

  return {
    request,
    timing,
    statusCode,
    headers,
    body,
    findInBody,
    findInHeader,
    getResult: () => result,
    getOptions,
    isJson,
    dotBody
  };
};

module.exports = Response;
