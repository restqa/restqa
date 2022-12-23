const chalk = require("chalk");
const fsm = require("fuzzy-string-matching");
const Steps = require("./cli/steps");

function RestQASnippetSyntax(snippetInterface) {
  this.snippetInterface = snippetInterface;
}

RestQASnippetSyntax.prototype.build = function ({
  comment,
  generatedExpressions,
  functionName,
  stepParameterNames
}) {
  const {configFile} = global.restqa;
  const keyword = functionName.toLowerCase();
  const restqaSteps = Steps(keyword, {config: configFile, print: false});
  const steps = generatedExpressions.map((step) => {
    step.matchs = restqaSteps
      .filter(({Step}) => {
        const match = fsm(Step, step.expressionTemplate);
        return match > 0.2;
      })
      .map((_) => _.Step);
    return step;
  });

  const result = {};
  result.headers = ["", "😵 Oooppps! The steps does not exist:"];

  result.body = steps
    .map((step) => {
      let result = [
        '"""',
        functionName + " " + step.expressionTemplate,
        '"""',
        ""
      ];
      if (step.matchs.length > 0) {
        result = result.concat([
          "Did you mean:",
          step.matchs
            .map((x) => "- " + functionName + " " + x.replace("\\", ""))
            .join("\n"),
          "",
          "---"
        ]);
      }
      return result;
    })
    .flat();

  result.footer = [
    "",
    "If the problem persist, please try to check the following:",
    "👉 Check if you don't have any random spaces at the begining, in the middle or at the end of the line.",
    `👉 Check the available steps on your project by using the command: ${chalk.bold.cyan(
      "restqa steps " + functionName.toLowerCase()
    )}`,
    `👉 Get more support by contacting us: ${chalk.yellow(
      "https://restqa.io/chat"
    )}`,
    "",
    "or...",
    "",
    `🚀 Create you own step definition: ${chalk.yellow(
      "https://docs.restqa.io"
    )}`,
    "",
    "Thank you for using RestQA! 💜"
  ];

  return chalk.redBright(
    [result.headers, result.body, result.footer].flat().join("\n")
  );
};

module.exports = RestQASnippetSyntax;
