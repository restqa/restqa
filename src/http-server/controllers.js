const Stream = require("stream");
const path = require("path");
const {version} = require("../../package.json");
const RestQA = require("../../src");
const Remote = require("./services/remote");
const Report = require("./services/report");
const Project = require("./services/project");
const {URL} = require("url");
const fs = require("fs");
const os = require("os");
const Welcome = require("../utils/welcome");

const Controllers = {};

Controllers.version = function (req, res) {
  res.json({version});
};

Controllers.config = async function (req, res, next) {
  const file = req.app.get("restqa.configuration");
  const options = req.app.get("restqa.options");
  try {
    const result = Project.config(file, options);
    res.json(result);
  } catch (e) {
    const pkg = path.resolve(options.folder || process.cwd(), "package.json");
    if (
      options.isHooked === true &&
      fs.existsSync(pkg) &&
      !fs.existsSync(options.configFile)
    ) {
      const packageContent = JSON.parse(fs.readFileSync(pkg).toString("utf-8"));
      const port = req.headers.host.split(":")[1];
      const opt = {
        name: packageContent.name,
        description: packageContent.description || packageContent.name,
        env: "local",
        url: `http://localhost:${port}`,
        folder: options.folder
      };

      const result = await RestQA.Initialize(opt);
      req.app.set("restqa.configuration", result);
      const config = Project.config(result, options);
      return res.json(config);
    }
    next(e);
  }
};

Controllers.steps = function (req, res, next) {
  try {
    const {keyword} = req.query;

    const keywords = (keyword && [keyword]) || ["given", "when", "then"];

    const result = keywords
      .map((keyword) => {
        const options = {
          keyword,
          configFile: req.app.get("restqa.configuration")
        };
        return RestQA.Steps(options);
      })
      .flat()
      .map((item) => ({
        plugin: item.Plugin,
        comment: item.Comment,
        step: item.Step,
        keyword: item.Keyword
      }));

    res.json(result);
  } catch (e) {
    next(e);
  }
};

Controllers.initialize = async function (req, res, next) {
  try {
    const options = req.app.get("restqa.options");
    req.body.folder = req.body.folder || options.folder;
    const result = await RestQA.Initialize(req.body || {});
    res.json({
      configuration: result,
      folder: path.dirname(result)
    });
    req.app.set("restqa.configuration", result);
  } catch (e) {
    next(e);
  }
};

Controllers.generate = async function (req, res, next) {
  try {
    const {cmd} = req.body;

    const scenario = await RestQA.Generate(cmd);
    res.json({scenario});
  } catch (e) {
    next(e);
  }
};

Controllers.install = async function (req, res, next) {
  try {
    const options = req.body;
    options.configFile = req.app.get("restqa.configuration");
    const config = await RestQA.Install(options);
    res.status(201).json({config});
  } catch (e) {
    next(e);
  }
};

Controllers.run = async function (req, res, next) {
  try {
    const {server} = req.app.get("restqa.options");

    const options = req.body;
    options.configFile = req.app.get("restqa.configuration");
    options.stream = new Stream.Writable();
    options.stream._write = () => {};
    options.path = path.resolve(server.testFolder, options.path || "");
    const result = await RestQA.Run(options);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

Controllers.info = async function (req, res) {
  const result = await Remote.info();
  res.json(result);
};

Controllers.createReports = async function (req, res, next) {
  try {
    const {server} = req.app.get("restqa.options");
    const outputFolder = server.report.outputFolder;
    const result = await Report.create(outputFolder, req.body);
    result.url = new URL("http://foo.bar"); // Sadly this class can't be instanciate without parameter so let me pass a fake one!
    result.url.protocol = req.protocol;
    result.url.host = req.headers.host;
    result.url.pathname = server.report.urlPrefixPath + "/" + result.id;
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

Controllers.getReports = function (req, res, next) {
  try {
    const {server} = req.app.get("restqa.options");
    const outputFolder = server.report.outputFolder;
    const list = Report.get(outputFolder).map((item) => {
      const result = {
        id: item.id,
        url: new URL("http://foo.bar") // Sadly this class can't be instanciate without parameter so let me pass a fake one!
      };
      result.url.protocol = req.protocol;
      result.url.host = req.headers.host;
      result.url.pathname = server.report.urlPrefixPath + "/" + item.id;
      return result;
    });
    res.json(list);
  } catch (e) {
    next(e);
  }
};

Controllers.getFeatures = function (req, res, next) {
  const {server} = req.app.get("restqa.options");
  const result = Project.features(server.testFolder);
  res.json(result);
};

Controllers.getFeaturesFile = function (req, res, next) {
  const {server} = req.app.get("restqa.options");
  const file = req.params[0];
  try {
    const result = fs
      .readFileSync(path.resolve(server.testFolder, file))
      .toString("utf-8");
    res.send(result);
  } catch (e) {
    let err = e;
    if (e.code === "ENOENT") {
      err = new RangeError(
        `The file "${file}" doesn't exist in the folder "${server.testFolder}"`
      );
    }
    next(err);
  }
};

Controllers.updateFeaturesFile = function (req, res, next) {
  const {server} = req.app.get("restqa.options");
  const file = req.params[0];
  try {
    const filepath = path.resolve(server.testFolder, file);
    if (!fs.existsSync(filepath)) {
      const e = new Error("");
      e.code = "ENOENT";
      throw e;
    }
    fs.writeFileSync(filepath, req.body);
    res.sendStatus(204);
  } catch (e) {
    let err = e;
    if (e.code === "ENOENT") {
      err = new RangeError(
        `The file "${file}" doesn't exist in the folder "${server.testFolder}"`
      );
    }
    next(err);
  }
};

Controllers.tips = function (req, res) {
  const config = Project.config(req.app.get("restqa.configuration"));

  const pattern = [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
  ].join("|"); // regex taken from the library https://github.com/chalk/ansi-regex

  const tips = new Welcome((config.restqa || {}).tips);
  res.json({
    message: tips.toString().replace(new RegExp(pattern, "g"), "")
  });
};

Controllers.preferences = function (req, res) {
  const filepath = path.resolve(os.homedir(), ".config", "restqa.pref");
  let content = "{}";
  if (fs.existsSync(filepath)) {
    content = fs.readFileSync(filepath, "utf-8");
  }
  res.json(JSON.parse(content));
};

module.exports = Controllers;
