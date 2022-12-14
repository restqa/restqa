const {Formatter, formatterHelpers, Status} = require("@cucumber/cucumber");
const chalk = require("chalk");
// class SimpleFormatter extends SummaryFormatter {
class LocalTestFormatter extends Formatter {
  constructor(options) {
    super(options);
    options.eventBroadcaster.on("envelope", (envelope) => {
      // console.log(envelope)
      envelope.testCaseStarted &&
        this.onTestCaseStarted(envelope.testCaseStarted);
      envelope.testCaseFinished &&
        this.onTestCaseFinised(envelope.testCaseFinished);
      envelope.testRunFinished &&
        this.onTestRunFinished(envelope.testRunFinished);
    });
  }

  get outputStream() {
    return global.restqa.outputStream;
  }

  onTestCaseStarted(envelope) {
    const uuid = envelope.id;
    const testCaseAttempt = this.eventDataCollector.getTestCaseAttempt(uuid);

    const instance = new LocalTestOutput(uuid);
    instance.feature = testCaseAttempt.gherkinDocument.feature.name;
    instance.scenario = testCaseAttempt.pickle.name;
    this.outputStream.add(instance);
  }

  onTestCaseFinised(envelope) {
    const uuid = envelope.testCaseStartedId;
    const testCaseAttempt = this.eventDataCollector.getTestCaseAttempt(uuid);
    const {status} = testCaseAttempt.worstTestStepResult;

    const parsed = formatterHelpers.parseTestCaseAttempt({
      cwd: this.cwd,
      snippetBuilder: this.snippetBuilder,
      supportCodeLibrary: this.supportCodeLibrary,
      testCaseAttempt
    });

    const failedStep = parsed.testSteps.find(
      (step) => step.result.status === Status.FAILED
    );

    let error;
    if (failedStep) {
      error = failedStep.result.message
        .split("\n")
        .map((_) => `    ${_.trim()}`.trimEnd());
      if (failedStep.sourceLocation) {
        error.pop();
        const {uri, line} = failedStep.sourceLocation;
        error.push(`    at ${uri}:${line}\n`);
      }
      error = chalk.red(error.join("\n")) + "\n";
    }
    this.outputStream.updateStatus(uuid, status, error);

    parsed.testSteps.forEach((testStep) => {
      if (testStep.result.status === Status.UNDEFINED) {
        this.outputStream.write(testStep.snippet + "\n");
      }
    });
  }

  onTestRunFinished({success}) {
    this.outputStream.success = success;
  }
}

class LocalTestOutput {
  constructor(uuid) {
    this._uuid = uuid;
  }

  get uuid() {
    return this._uuid;
  }

  set feature(val) {
    this._feature = val;
  }

  get feature() {
    return this._feature;
  }

  set scenario(val) {
    this._scenario = val;
  }

  get scenario() {
    return this._scenario;
  }

  set status(val) {
    this._status = val;
  }

  get status() {
    return this._status;
  }

  get emoji() {
    let result = "";
    switch (this.status) {
      case Status.PASSED:
        result = "✅";
        break;
      case Status.SKIPPED:
        result = "🚧";
        break;
      case Status.FAILED:
        result = "❌";
        break;
      case Status.UNDEFINED:
        result = "⁉️";
        break;
    }
    return result;
  }

  getColor() {
    let result = chalk.grey;
    switch (this.status) {
      case "PASSED":
        result = chalk.green;
        break;
      case "SKIPPED":
        result = chalk.yellow;
        break;
      case "FAILED":
        result = chalk.red;
        break;
      case "UNDEFINED":
        result = chalk.white;
        break;
    }
    return result;
  }

  toString() {
    const color = this.getColor().bold;
    return `${this.emoji} ${color(this.status)} - ${this.feature} > ${
      this.scenario
    }\n`;
  }
}

module.exports = LocalTestFormatter;
