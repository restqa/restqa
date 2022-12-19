const {Logger} = require("@restqa/core-logger");
const Telemetry = require("../utils/telemetry");

module.exports = function (status) {
  const telemetry = new Telemetry();

  status = status.toLowerCase();
  const choices = ["on", "off"];

  if (!choices.includes(status)) {
    throw new Error("The status is incorrect. Available: on | off");
  }

  telemetry.toggle(status === "on");
  Logger.success(
    "service.telemetry.toggle",
    status === "on" ? "enabled" : "disabled"
  );
  Logger.info(
    "service.telemetry.detail",
    "https://dashboard.restqa.io/#/documentation/telemetry"
  );
};
