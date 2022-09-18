const path = require("path");
const fs = require("fs");

function getPackageJson(pathSegment = process.cwd()) {
  const packageJsonPath = path.resolve(pathSegment, "package.json");
  if (typeof packageJsonPath === "string" && fs.existsSync(packageJsonPath)) {
    const rawPkg = fs.readFileSync(packageJsonPath).toString("utf-8");
    return JSON.parse(rawPkg);
  }

  return null;
}

module.exports = {
  getPackageJson
};
