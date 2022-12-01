const Path = require("path");
const fs = require("fs");
const {Generator} = require("@restqa/plugin-rest-api");
const chalk = require("chalk");

module.exports = function (options) {
  options.event.on("transaction", async (transaction) => {
    const scenario = transaction.request.headers["x-restqa-scenario"];

    delete transaction.request.headers["x-restqa-scenario"];
    delete transaction.request.headers["content-type"];
    delete transaction.request.headers["content-length"];
    delete transaction.request.headers.accept;
    delete transaction.request.headers["accept-encoding"];
    delete transaction.request.headers.host;
    delete transaction.request.headers.connection;

    const steps = await Generator(transaction);

    if (scenario) {
      WriteFile(transaction, scenario, steps);
    } else {
      WriteConsole(steps);
    }
  });

  function WriteConsole(steps) {
    const content = [
      "------------------------------------------",
      `${chalk.green("New Test Scenarion generated")} 🚀🚀🚀`,
      "------------------------------------------",
      steps.trim(),
      "------------------------------------------"
    ].join("\n");
    options.stream.write(content);
  }

  function WriteFile(transaction, scenario, steps) {
    const method = transaction.request.method;
    const path = transaction.request.path;

    const file = `${method}${path.replace(/\//g, "_")}.feature`;
    const filename = Path.resolve(options.outputFolder, file);

    const dirname = Path.dirname(filename);
    fs.mkdirSync(dirname, {recursive: true});

    let fileContent = `Feature: ${method} ${path}`;
    if (fs.existsSync(filename)) {
      fileContent = fs.readFileSync(filename).toString("utf-8");
    }

    const result = appendOrReplaceInFile(scenario, steps, fileContent);
    fs.writeFileSync(filename, result);
    const log = [
      "\n",
      "------------------------------------------",
      `🤗 Scenario "${chalk.yellow(scenario)}" added to the file "${chalk.green(
        filename.replace(process.cwd(), "").substring(1)
      )}"`,
      "------------------------------------------",
      "\n"
    ].join("\n");
    options.stream.write(log);
  }
};

function appendOrReplaceInFile(scenario, steps, fileContent) {
  const content = `
Scenario: ${scenario}
${steps}
    `.trim();

  if (fileContent.includes(scenario)) {
    // replace
    const lines = fileContent.split("\n");
    const startIndex = lines.findIndex((line) => line.includes(scenario));
    let endIndex = 0;
    for (let i = startIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (/^scenario:/i.test(line)) {
        endIndex = i - 1;
      }
    }

    if (endIndex === 0) {
      endIndex = lines.length;
    }

    const portion = lines.slice(startIndex, endIndex).join("\n");
    fileContent = fileContent.replace(portion, content);
  } else {
    // add
    fileContent += "\n\n";
    fileContent += content;
  }

  return fileContent;
}
