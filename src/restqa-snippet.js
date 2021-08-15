const chalk = require("chalk");

function RestQASnippetSyntax(snippetInterface) {
  this.snippetInterface = snippetInterface;
}

RestQASnippetSyntax.prototype.build = function ({
  comment,
  generatedExpressions,
  functionName,
  stepParameterNames
}) {
  const result = [
    "",
    `😵 Oooppps! We are facing an issue with the step${
      generatedExpressions.length > 1 ? "s" : ""
    }:`,
    '"""',
    generatedExpressions.map((_) => _.expressionTemplate).join("\n"),
    '"""',
    "",
    "Do not worry! We are here to find a solution for the error your encountering. Please try to check the following:",
    "---",
    "👉 Check if you don't have any random spaces at the begining, in the middle or at the end of the line.",
    `👉 Check the available steps on your project by using the command: ${chalk.bold.cyan(
      "restqa steps " + functionName.toLowerCase()
    )}`,
    `👉 Look at the documentation: ${chalk.yellow(
      "https://docs.restqa.io/tests/introduction"
    )}`,
    `👉 Get more support by opening a new issue at ${chalk.yellow(
      "https://github.com/restqa/restqa/issues/new/choose"
    )}`,
    "",
    "Thank you for using RestQA! 💜"
  ].join("\n");

  return chalk.redBright(result);
};

module.exports = RestQASnippetSyntax;
