const Preference = require("./preference");
const fs = require("fs");
const path = require("path");

const jestqa = new JestQA(__filename, true);

beforeEach(jestqa.beforeEach);
afterEach(jestqa.afterEach);

describe("#Preference instance", () => {
  test("write and get preference", () => {
    const filename = path.resolve(jestqa.getTmpFolder(), "restqa.pref");
    const preference = new Preference(filename);
    preference.telemetry = true;
    preference.addProject("api-advisors", {
      url: "git@github.com:/restqa/template.git",
      age: "4y",
      versionControl: "github",
      language: "nodejs"
    });

    expect(preference.getFilename()).toBe(filename);
    expect(preference.telemetry).toBe(true);
    expect(preference.getProject("api-advisors")).toEqual({
      url: "git@github.com:/restqa/template.git",
      age: "4y",
      versionControl: "github",
      language: "nodejs"
    });

    expect(fs.existsSync(preference.getFilename())).toBe(true);
    const expectedPreference = JSON.stringify({
      telemetry: true,
      projects: {
        "api-advisors": {
          url: "git@github.com:/restqa/template.git",
          age: "4y",
          versionControl: "github",
          language: "nodejs"
        }
      }
    });
    expect(fs.readFileSync(filename).toString()).toEqual(expectedPreference);
  });

  test("load, update and get preference", () => {
    const content = JSON.stringify({
      telemetry: true,
      projects: {
        customers: {
          url: "git@github.com:/restqa/customers.git",
          age: "1y",
          versionControl: "gitlab",
          language: "go"
        }
      }
    });

    const filename = jestqa.createTmpFile(content, "restqa.pref");
    const preference = new Preference(filename);
    preference.telemetry = false;
    preference.addProject("api-advisors", {
      url: "git@github.com:/restqa/template.git",
      age: "4y",
      versionControl: "github",
      language: "nodejs"
    });

    expect(preference.getFilename()).toBe(filename);
    expect(fs.existsSync(preference.getFilename())).toBe(true);
    expect(preference.telemetry).toBe(false);
    expect(preference.getProject("customers")).toEqual({
      url: "git@github.com:/restqa/customers.git",
      age: "1y",
      versionControl: "gitlab",
      language: "go"
    });
    expect(preference.getProject("api-advisors")).toEqual({
      url: "git@github.com:/restqa/template.git",
      age: "4y",
      versionControl: "github",
      language: "nodejs"
    });

    const expectedPreference = JSON.stringify({
      telemetry: false,
      projects: {
        customers: {
          url: "git@github.com:/restqa/customers.git",
          age: "1y",
          versionControl: "gitlab",
          language: "go"
        },
        "api-advisors": {
          url: "git@github.com:/restqa/template.git",
          age: "4y",
          versionControl: "github",
          language: "nodejs"
        }
      }
    });
    expect(fs.readFileSync(filename).toString()).toEqual(expectedPreference);
  });
});
