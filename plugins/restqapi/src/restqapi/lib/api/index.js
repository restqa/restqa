const got = require("got");
const Request = require("./request");
const Response = require("./response");

module.exports = function (options) {
  const {config} = options;
  let error;
  const run = async function () {
    try {
      const options = this.request.getOptions();
      console.log(options)
      const result = await got(options);
      this.response = new Response(result.restqa);
    } catch (e) {
      // console.log('--------', e)
      if (e.response) {
        this.response = new Response(e.response.restqa);
      } else {
        error = e;
        throw e;
      }
    }
  };
  return {
    config,
    request: new Request(config.url, config.insecure),
    response: null,
    run,
    toJSON: function () {
      return {
        curl: this.getCurl(),
        request: this.request.getOptions(),
        response: this.response && this.response.getResult(),
        error: error && error.message
      };
    },
    getCurl: function () {
      let {protocol, hostname, pathname, method, searchParams, headers, json, port } =
        this.request.getOptions();

      const {bodyBackup} = this.request;
      const curlCommand = [];

      // method
      method = method ? String(method).toUpperCase() : "GET";
      curlCommand.push("curl -X " + method);

      // header
      for (const key in headers) {
        if (["x-correlation-id", "user-agent"].includes(key)) {
          continue;
        }
        curlCommand.push('-H "' + key + ": " + headers[key] + '"');
      }

      // Content-Type: json
      if (json) {
        curlCommand.push(
          '-H "Content-Type: application/json" --data \'' +
            JSON.stringify(json) +
            "'"
        );
      }

      // Content-Type: application/x-www-form-urlencoded
      if (Object.keys(bodyBackup).length !== 0) {
        const data = [];
        for (const key in bodyBackup) {
          data.push(" --data '" + key + "=" + bodyBackup[key] + "'");
        }
        curlCommand.push(
          '-H "Content-Type: application/x-www-form-urlencoded"' + data.join("")
        );
      }

      // ignoreSSL
      if (this.request.getOptions().rejectUnauthorized === false) {
        curlCommand.push("-k");
      }

      // URL + PATH + searchParams
      if (searchParams) {
        const params = [];
        for (const key in searchParams) {
          params.push(key + "=" + searchParams[key]);
        }
        curlCommand.push(
          "--url " +
            protocol +
            "//" +
            hostname +
            (port ?  `:${port}`: '' )+
            pathname +
            "?" +
            params.join("&")
        );
      } else {
        curlCommand.push("--url " + protocol + "//" + hostname + (port ?  `:${port}`: '' ) + pathname)
      }

      return curlCommand.join(" ");
    }
  };
};
