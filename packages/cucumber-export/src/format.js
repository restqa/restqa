const moment = require("moment");

module.exports = function (metadata, testResult) {
  metadata.duration = metadata.duration / 1e9;
  metadata.durationFormat = moment.utc(metadata.duration / 1e6).format("mm:ss");

  const features = testResult.map((feature) => {
    const scenarios = feature.elements.map((scenario) => {
      scenario.step_passed = scenario.steps.filter(
        (r) => r.result.status === "passed"
      ).length;
      scenario.step_failed = scenario.steps.filter(
        (r) => r.result.status === "failed"
      ).length;
      scenario.step_skipped = scenario.steps.filter(
        (r) => r.result.status === "skipped"
      ).length;
      scenario.step_undefined = scenario.steps.filter(
        (r) => r.result.status === "undefined"
      ).length;

      scenario.result = scenario.step_passed === scenario.steps.length;

      if (!scenario.status && scenario.step_failed) scenario.status = "failed";
      if (!scenario.status && scenario.step_skipped)
        scenario.status = "skipped";
      if (!scenario.status && scenario.result) scenario.status = "passed";
      if (!scenario.status) scenario.status = "undefined";

      scenario.duration = scenario.steps.reduce(
        (r, i) => r + ((i.result && i.result.duration) || 0),
        0
      );
      scenario.duration = scenario.duration / 1000000000; // 'secondes'
      scenario.timestamp = moment().format();

      scenario.metadata = metadata;

      return scenario;
    });

    feature.elements = scenarios;

    feature.total = feature.elements.length;
    feature.passed = feature.elements.filter(
      (_) => _.status === "passed"
    ).length;
    feature.failed = feature.elements.filter(
      (_) => _.status === "failed"
    ).length;
    feature.skipped = feature.elements.filter(
      (_) => _.status === "skipped"
    ).length;
    feature.undefined = feature.elements.filter(
      (_) => _.status === "undefined"
    ).length;

    feature.result = feature.total === feature.passed;

    feature.duration = feature.elements.reduce((r, i) => r + i.duration, 0);

    feature.timestamp = moment().format();
    feature.type = "feature";
    feature.feature_name = feature.name;
    delete feature.name;

    feature.metadata = metadata;
    return feature;
  });

  const testSuite = {
    ...metadata,
    timestamp: moment().format(),
    type: "testSuite",
    total: features.length,
    success:
      features.reduce((total, feature) => total + feature.failed, 0) === 0,
    passed: features.filter((r) => r.result).length,
    failed: features
      .filter((r) => r.total !== r.skipped)
      .filter((r) => !r.result).length,
    skipped: features.filter((r) => r.total === r.skipped).length,
    scenarios: {
      passed: features.reduce((total, feature) => total + feature.passed, 0),
      failed: features.reduce((total, feature) => total + feature.failed, 0),
      skipped: features.reduce((total, feature) => total + feature.skipped, 0),
      undefined: features.reduce(
        (total, feature) => total + feature.undefined,
        0
      )
    },
    features
  };

  return testSuite;
};
