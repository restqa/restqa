function Default(formatter, error) {
  const instance = error;
  instance.formatter = formatter;
  instance.name = "DEFAULT";

  instance.customMsg = `[${formatter}] - ${instance.message}`;
  instance.info = {
    formatter,
    formatterMessage: instance.customMsg,
    message: error.message,
    stack: error.stack
  };

  instance.toString = function () {
    return Object.keys(this.info)
      .map((_) => `${_} : ${this.info[_]}`)
      .join("\n");
  };

  Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
  Error.captureStackTrace(instance, Default);
  return instance;
}

module.exports = Default;
