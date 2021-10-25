const express = require("express");
const path = require("path");

module.exports = function (configFile, options = {}) {
  options = formatOptions(options);

  return express()
    .disable("x-powered-by")
    .set("restqa.configuration", configFile)
    .set("restqa.options", options)
    .use((req, res, next) => {
      const {origin} = req.headers;
      const whiteList = ["http://localhost:3000"].concat(
        (options.server && options.server.whiteList) || []
      );

      if (whiteList.includes(origin)) {
        res.set("Access-Control-Allow-Origin", origin);
        res.set(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept"
        );
        res.set("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");
      }
      next();
    })
    .use(express.text())
    .use(express.json())
    .get("/events", (req, res) => {
      if (!options.sandbox) {
        return res.status(406).json({
          message: "The sandbox mode is not enabled"
        });
      }

      options.sandbox.on("generated", (data) => {
        data = JSON.stringify(data);
        res.write(`data: ${data}\n\n`);
      });

      res.set({
        "Cache-Control": "no-cache",
        "Content-Type": "text/event-stream",
        Connection: "keep-alive"
      });

      res.flushHeaders();
    })
    .use(
      express.static(path.resolve(__dirname, "..", "..", "dashboard", "dist"))
    )
    .use(require("./routes"))
    .use("/api", express.static(path.resolve(__dirname, ".", "openapi")))
    .use(
      options.server.report.urlPrefixPath,
      express.static(path.resolve(options.server.report.outputFolder))
    )
    .use((err, req, res, next) => {
      if (err instanceof TypeError || err instanceof ReferenceError) {
        res.status(406);
      } else if (err instanceof RangeError) {
        res.status(404);
      } else {
        res.status(500);
      }
      res.json({
        message: err.message
      });
    });
};

function formatOptions(options) {
  options.server = options.server || {};
  options.server.whiteList = options.server.whiteList || [];
  options.server.report = options.server.report || {};
  options.server.report.urlPrefixPath =
    options.server.report.urlPrefixPath || "/reports";
  // @todo: add a validation to ensure the urlPrefixPathreport starts with a '/'
  options.server.report.outputFolder =
    options.server.report.outputFolder ||
    path.resolve(process.cwd(), "reports");
  if (options.folder) {
    options.server.testFolder =
      path.resolve(options.folder, options.server.testFolder || "") ||
      options.folder;
  } else {
    options.server.testFolder = options.server.testFolder || process.cwd();
  }
  return options;
}
