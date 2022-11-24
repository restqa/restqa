const stream = require("stream");

function createStreamErr(err) {
  return new Error(`[STREAM REPORT][ERROR] - ${err.message}`);
}

module.exports = function (config, result) {
  return new Promise((resolve, reject) => {
    if (!config.instance)
      return reject(
        new Error('config.instance is required for the "stream" report')
      );

    if (!(config.instance instanceof stream.Writable)) {
      return reject(new Error("config.instance should be a writable stream"));
    }

    config.instance.on("error", (err) => {
      return reject(createStreamErr(err));
    });

    try {
      const buffer = Buffer.from(JSON.stringify(result));
      config.instance.write(buffer);
    } catch (err) {
      return reject(createStreamErr(err));
    }

    config.instance.end((err) => {
      if (err) return reject(createStreamErr(err));
      resolve("[STREAM REPORT] - Content successfully written into the stream");
    });
  });
};
