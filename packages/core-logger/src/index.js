const {format} = require("util");
const chalk = require("chalk");
const debug = require("debug")("restqa");

const LANGUAGES = {
  en: require("../locales/en.json")
};

const DEFAULT_LANGUAGE = Object.keys(LANGUAGES)[0];

function _log() {
  console.info(format.apply(this, arguments)); // eslint-disable-line no-console
}

const Logger = {
  debug: function () {
    debug(...arguments);
  },
  error: function () {
    debug(arguments[0]);
    if (!(arguments[0] instanceof Error)) {
      arguments[0] = Locale(arguments[0]) || arguments[0];
    } else if (
      arguments[0].constructor &&
      arguments[0].constructor.name === "VError"
    ) {
      arguments[0] = arguments[0].jse_cause;
    } else {
      debug(arguments[0]);
    }
    arguments[0] = chalk.bold.red.call(this, arguments[0]);
    _log.apply(this, arguments);
  },
  info: function () {
    arguments[0] = Locale(arguments[0]) || arguments[0];
    arguments[0] = chalk.bold.blue.call(this, arguments[0]);
    _log.apply(this, arguments);
  },
  log: function () {
    arguments[0] = Locale(arguments[0]) || arguments[0];
    _log.apply(this, arguments);
  },
  success: function () {
    arguments[0] = Locale(arguments[0]) || arguments[0];
    arguments[0] = chalk.bold.green.call(this, arguments[0]);
    _log.apply(this, arguments);
  },
  warning: function () {
    arguments[0] = Locale(arguments[0]) || arguments[0];
    arguments[0] = chalk.bold.yellow.call(this, arguments[0]);
    _log.apply(this, arguments);
  }
};

function Locale(prefix) {
  let result = LANGUAGES[DEFAULT_LANGUAGE];
  if (prefix) {
    result = prefix.split(".").reduce((_, item) => {
      _ = _ || {};
      return _[item];
    }, result);
  }
  return result;
}

module.exports = {
  Logger,
  Locale
};
