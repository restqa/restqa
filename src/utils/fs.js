const path = require("path");
const fs = require("fs");

function getPackageJson() {
  const packageJsonPath = path.resolve(process.cwd(), "package.json");
  if (typeof packageJsonPath === "string" && fs.existsSync(packageJsonPath)) {
    const rawPkg = fs.readFileSync(packageJsonPath).toString("utf-8");
    return JSON.parse(rawPkg);
  }

  return null;
}

module.exports = {
  getPackageJson
}
