const {cwd} = require("./utils/process.js");
const fs = require("fs");
const path = require("path");

function format(files) {
  return files.join("\n");
}

module.exports = function (options) {
  let {files = [], gitignore = path.resolve(cwd, ".gitignore")} = options;

  let lines = [];
  if (!fs.existsSync(gitignore)) {
    lines = files;
  } else {
    const initialContent = fs.readFileSync(gitignore).toString().split("\n");
    files = files.filter((item) => initialContent.includes(item) === false);
    if (files.length === 0) return;
    lines = initialContent.concat(files);
  }
  fs.writeFileSync(gitignore, format(lines));
};
