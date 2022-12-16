const os = require("os");
const fs = require("fs");
const path = require("path");

function createGitignore(content) {
  const id = Math.floor(Math.random() * 10000000) + "-" + Date.now();
  const mockTestPath = path.resolve(os.tmpdir(), id);
  if (!fs.existsSync(mockTestPath)) {
    fs.mkdirSync(mockTestPath);
  }
  const mockTestFile = path.resolve(mockTestPath, ".gitignore");
  if (Array.isArray(content)) {
    fs.writeFileSync(mockTestFile, content.join("\n"));
  }
  return {
    mockTestPath,
    mockTestFile
  };
}

describe("# contributors", () => {
  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  test("Create .gitinore if does not exist", () => {
    const {mockTestPath, mockTestFile} = createGitignore();
    jest.mock("../src/utils/process", () => {
      return {
        cwd: mockTestPath
      };
    });

    const {Ignore} = require("../");
    const options = {
      files: ["node_modules", "tests/"]
    };
    Ignore(options);

    expect(fs.existsSync(mockTestFile)).toEqual(true);
    const expectedContent = options.files.join("\n");
    const result = fs.readFileSync(mockTestFile).toString();
    expect(result).toEqual(expectedContent);
  });

  test("Update .gitinore if exists", () => {
    const initialContent = ["restqa"];
    const {mockTestPath, mockTestFile} = createGitignore(initialContent);

    jest.mock("../src/utils/process", () => {
      return {
        cwd: mockTestPath
      };
    });

    const {Ignore} = require("../");
    const options = {
      files: ["node_modules", "tests/"]
    };
    Ignore(options);

    expect(fs.existsSync(mockTestFile)).toEqual(true);
    const expectedContent = initialContent.concat(options.files).join("\n");
    const result = fs.readFileSync(mockTestFile).toString();
    expect(result).toEqual(expectedContent);
  });

  test("Update .gitinore if exists and don't add the files that already in the file (pass filename)", () => {
    const initialContent = ["restqa"];
    const {mockTestFile, mockTestPath} = createGitignore(initialContent);

    const {Ignore} = require("../");
    const options = {
      files: ["node_modules", "tests/", "restqa"],
      folder: mockTestPath
    };
    Ignore(options);

    expect(fs.existsSync(mockTestFile)).toEqual(true);
    const expectedContent = ["restqa", "node_modules", "tests/"].join("\n");
    const result = fs.readFileSync(mockTestFile).toString();
    expect(result).toEqual(expectedContent);
  });

  test("Update .gitinore if exists and do not update if all the item already in the file", () => {
    const initialContent = ["node_modules", "coverage", "tests/", "restqa"];
    const {mockTestPath, mockTestFile} = createGitignore(initialContent);
    const currentDateTime = fs.statSync(mockTestFile).mtime;

    jest.mock("../src/utils/process", () => {
      return {
        cwd: mockTestPath
      };
    });

    const {Ignore} = require("../");
    const options = {
      files: ["node_modules", "tests/", "restqa"]
    };
    Ignore(options);

    expect(fs.existsSync(mockTestFile)).toEqual(true);
    const expectedContent = initialContent.join("\n");
    const result = fs.readFileSync(mockTestFile).toString();
    expect(result).toEqual(expectedContent);

    const expectedDateTime = fs.statSync(mockTestFile).mtime;
    expect(currentDateTime).toEqual(expectedDateTime);
  });
});
