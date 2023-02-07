const os = require("os");
const path = require("path");
const fs = require("fs");
const Collection = require("../");

const fixtures = [
 "base-url",
 // "query-strings",
  "headers",
  //"authorization-bearer",
  //"authorization-basic-auth",
  //"request-body-json",
  //"request-body-form"
];

describe("collection", () => {
  test.each(fixtures)("Testing the fixture ./fixtures/%s", (fixtureFolder) => {
    const {simulation = [], collections, config = {}} = require("./fixtures/" +
      fixtureFolder);

    config.resultFolder = config.resultFolder || getTmpFolder();

    const instance = new Collection(config);
    simulation.forEach((testCase) => {
      instance.add(testCase.apis, testCase.scenario);
    });

    const result = instance.generate();

    Object.keys(collections).forEach((name) => {
      const expectedContent = collections[name];
      const content = JSON.parse(fs.readFileSync(result[name]).toString());
      expect(content).toEqual(expectedContent);
    });
  });
});

function getTmpFolder() {
  const id = Math.floor(Math.random() * 10000000) + "-" + Date.now();
  const mockTestPath = path.resolve(os.tmpdir(), id);
  if (!fs.existsSync(mockTestPath)) {
    fs.mkdirSync(mockTestPath);
  }
  return mockTestPath;
}
