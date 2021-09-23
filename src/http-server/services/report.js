const HtmlReport = require("@restqa/cucumber-export/src/reports/html");
const path = require("path");
const fs = require("fs");

module.exports = {
  get: function (folder) {
    const list = fs.readdirSync(folder) || [];
    return list
      .map((id) => {
        const stat = fs.statSync(`${path.resolve(folder, id)}`);
        return {
          id,
          createdDate: new Date(stat.mtime)
        };
      })
      .sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime())
      .map((_) => ({id: _.id}));
  },
  create: async function (folder, testResult) {
    if (folder) {
      folder = path.resolve(folder, testResult.id);
    }
    const config = {
      folder,
      browserOpening: false
    };

    await HtmlReport(config, testResult);
    return {
      id: testResult.id
    };
  }
};
