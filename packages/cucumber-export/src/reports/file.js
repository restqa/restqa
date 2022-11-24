const fs = require("fs");
const path = require("path");

module.exports = function (config, result) {
  return new Promise((resolve, reject) => {
    if (!config.path)
      return reject(new Error('config.path is required for the "file" report'));

    const fileName = path.resolve(config.path);
    const output = JSON.stringify(result, null, 2);

    fs.writeFile(fileName, output, "utf8", (err) => {
      if (err)
        return reject(
          new Error(`[FILE REPORT][ERROR] - ${config.path} : ${err.message}`)
        );
      resolve(`[FILE REPORT][SUCCESS] - ${fileName}`);
    });
  });
};
