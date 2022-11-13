const fs = require("fs");
const path = require("path");

const Given = {};

/*
 * =========================================
 * Request API Default Functions
 * =========================================
 */

function getCookie() {
  // Add a cookie if exist
  let {startSymbol, endSymbol} = this.data.options || {};

  startSymbol = startSymbol || "{{";
  endSymbol = endSymbol || "}}";

  const key = `${startSymbol}__cookie_jar__${endSymbol}`;
  const value = this.data.get(key);
  return key === value ? undefined : value;
}

Given.gateway = function () {
  this.api = this.createApi();
  const cookie = getCookie.call(this);
  if (cookie && cookie !== "undefined") {
    this.api.request.setHeader("cookie", cookie);
  }

  if (this.insecure === true) {
    this.api.request.ignoreSsl();
  }
};

Given.gatewayHost = function (url) {
  this.api = this.createApi(url);
  const cookie = getCookie.call(this);
  if (cookie) {
    this.api.request.setHeader("cookie", cookie);
  }

  if (this.insecure === true) {
    this.api.request.ignoreSsl();
  }
};

Given.ssl = function () {
  this.api = this.api || this.createApi();
  this.api.request.ignoreSsl();
};

/*
 * =========================================
 * Request Headers Functions
 * =========================================
 */
Given.header = function (property, value) {
  this.api = this.api || this.createApi();
  value = this.data.get(value);
  this.api.request.setHeader(property, value);
};

Given.headers = function (table) {
  this.api = this.api || this.createApi();
  table.raw().forEach((args) => Given.header.apply(this, args));
};

Given.bearer = function (value) {
  this.api = this.api || this.createApi();
  Given.header.call(this, "authorization", `Bearer ${value}`);
};

Given.basicAuth = function (username, pass) {
  this.api = this.api || this.createApi();
  username = this.data.get(username);
  pass = this.data.get(pass);
  const encoded = Buffer.from(username + ":" + pass, "utf8").toString("base64");
  Given.header.call(this, "authorization", `Basic ${encoded}`);
};

/*
 * =========================================
 * Request Query string Functions
 * =========================================
 */
Given.queryString = function (property, value) {
  this.api = this.api || this.createApi();
  value = this.data.get(value);
  this.api.request.setQueryString(property, value);
};

Given.qs = function (table) {
  table.raw().forEach((args) => Given.queryString.apply(this, args));
};

/*
 * =========================================
 * Request Body Functions
 * =========================================
 */
Given.payload = function (property, value) {
  this.api = this.api || this.createApi();
  value = this.data.get(value);
  this.api.request.addPayload(property, value);
};

Given.payloads = function (table) {
  table.raw().forEach((args) => Given.payload.apply(this, args));
};

Given.jsonPayload = function (value) {
  this.api = this.api || this.createApi();
  value = this.data.get(value);
  value = JSON.parse(value);
  this.api.request.setPayload(value);
};

Given.jsonFilePayload = function (filename) {
  this.api = this.api || this.createApi();
  if (path.extname(filename) !== ".json") {
    throw new Error(`The file "${filename}" should be a .json file`);
  }

  let filepath = this.data.get(filename);
  filepath = this.data.getFile(filepath);
  let content = fs.readFileSync(filepath).toString("utf-8");
  try {
    content = JSON.parse(content);
  } catch (e) {
    throw new Error(`The file "${filename}" doesn't contain a valid JSON`);
  }
  this.api.request.setPayload(content);
};

Given.form = function (field, value) {
  this.api = this.api || this.createApi();
  value = this.data.get(value);
  this.api.request.addFormField(field, value);
};

Given.forms = function (table) {
  table.raw().forEach((args) => Given.form.apply(this, args));
};

Given.formUpload = function (filename, field) {
  this.api = this.api || this.createApi();
  filename = this.data.get(filename);
  filename = this.data.getFile(filename);
  const file = fs.createReadStream(filename);
  this.api.request.addFormField(field, file);
};

module.exports = Given;
