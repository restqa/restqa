const os = require("os");
const fs = require("fs");
const path = require("path");

describe("# contributors", () => {
  let mockTestPath = null;
  beforeEach(() => {
    const id = Math.floor(Math.random() * 10000000) + "-" + Date.now();
    mockTestPath = path.resolve(os.tmpdir(), id);
    if (!fs.existsSync(mockTestPath)) {
      fs.mkdirSync(mockTestPath);
    }
  });
  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  test("return empty array if the .git folder is not detected", async () => {
    const {Contributors} = require("../");
    const options = {
      path: mockTestPath
    };

    const result = await Contributors(options);
    expect(result).toEqual([]);
  });

  test("return empty result if has an error", async () => {
    jest.mock("child_process", () => {
      return {
        exec: (cmd, fn) => {
          const error = new Error("my Error");
          const stdout = ``;
          const stderr = ``;
          fn(error, stdout, stderr);
        }
      };
    });

    const {Contributors} = require("../");
    const result = await Contributors();
    const expectedResult = [];
    expect(result).toEqual(expectedResult);
  });

  test("return empty result if has an stderror", async () => {
    jest.mock("child_process", () => {
      return {
        exec: (cmd, fn) => {
          const error = null;
          const stdout = ``;
          const stderr = `oups something when wrong`;
          fn(error, stdout, stderr);
        }
      };
    });

    fs.mkdirSync(path.resolve(mockTestPath, ".git"));
    jest.mock("../src/utils/process", () => {
      return {
        cwd: mockTestPath
      };
    });

    const {Contributors} = require("../");
    const result = await Contributors();
    const expectedResult = [];
    expect(result).toEqual(expectedResult);
  });

  test("return the list of contributors and dedup matching names", async () => {
    jest.mock("child_process", () => {
      return {
        exec: (cmd, fn) => {
          const error = null;
          const stdout = `
            456  Olivier <hi@olivierodo.me>
            175  tony-go <gorez.tony@gmail.com>
             84  Olivier <rodomond.o@gmail.com>
             36  OliverOdo <hi@olivierodo.me>
             23  dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
              2  Olivier Rodomond <olivierodo@Oliviers-Air.lan>
              2  Mason Woodford <mwoodfor@ucsc.edu>
              2  KaTLaz <65902811+KaTLaz@users.noreply.github.com>
              2  pimpannt <pimpannt@gmail.com>
              2  restqa-bot <null>
              1  Tony Gorez <gorez.tony@gmail.com>
              1  OliverOdo <rodomond.o@gmail.com>
          `;
          const stderr = ``;
          fn(error, stdout, stderr);
        }
      };
    });

    fs.mkdirSync(path.resolve(mockTestPath, ".git"));
    jest.mock("../src/utils/process", () => {
      return {
        cwd: mockTestPath
      };
    });

    const {Contributors} = require("../");
    const result = await Contributors();
    const expectedResult = [
      {
        commits: 579,
        username: "Olivier",
        email: "hi@olivierodo.me",
        avatar:
          "https://www.gravatar.com/avatar/6b262c3874c116f42b3a7abf26b9dc5b",
        matches: ["OliverOdo", "Olivier Rodomond", "OliverOdo"],
        percent: 73
      },
      {
        commits: 176,
        username: "tony-go",
        email: "gorez.tony@gmail.com",
        avatar:
          "https://www.gravatar.com/avatar/a7723d411779f7a8db4d4ada86a92daa",
        matches: ["Tony Gorez"],
        percent: 22
      },
      {
        commits: 23,
        username: "dependabot[bot]",
        email: "49699333+dependabot[bot]@users.noreply.github.com",
        avatar:
          "https://www.gravatar.com/avatar/48ea49be76d0c68403a7f3df87e3487d",
        matches: [],
        percent: 2
      },
      {
        commits: 2,
        username: "Mason Woodford",
        email: "mwoodfor@ucsc.edu",
        avatar:
          "https://www.gravatar.com/avatar/48c53c7f87a7243c1df2418a0391c475",
        matches: [],
        percent: 0
      },
      {
        commits: 2,
        username: "KaTLaz",
        email: "65902811+KaTLaz@users.noreply.github.com",
        avatar:
          "https://www.gravatar.com/avatar/9b96229f443b3b44397d6ae23ec8dda5",
        matches: [],
        percent: 0
      },
      {
        commits: 2,
        username: "pimpannt",
        email: "pimpannt@gmail.com",
        avatar:
          "https://www.gravatar.com/avatar/a540af6d867afaba29f28b5a7bfbc375",
        matches: [],
        percent: 0
      }
    ];
    expect(result).toEqual(expectedResult);
  });

  test("return the list of contributors", async () => {
    jest.mock("child_process", () => {
      return {
        exec: (cmd, fn) => {
          const error = null;
          const stdout = `
            456  Olivier <hi@olivierodo.me>
            175  tony-go <gorez.tony@gmail.com>
             2  Mason Woodford <mwoodfor@ucsc.edu>
             2  KaTLaz <65902811+KaTLaz@users.noreply.github.com>
             2  pimpannt <pimpannt@gmail.com>
             2  restqa-bot <null>
          `;
          const stderr = ``;
          fn(error, stdout, stderr);
        }
      };
    });

    fs.mkdirSync(path.resolve(mockTestPath, ".git"));
    jest.mock("../src/utils/process", () => {
      return {
        cwd: mockTestPath
      };
    });

    const {Contributors} = require("../");
    const result = await Contributors();
    const expectedResult = [
      {
        commits: 456,
        username: "Olivier",
        email: "hi@olivierodo.me",
        avatar:
          "https://www.gravatar.com/avatar/6b262c3874c116f42b3a7abf26b9dc5b",
        matches: [],
        percent: 71
      },
      {
        commits: 175,
        username: "tony-go",
        email: "gorez.tony@gmail.com",
        avatar:
          "https://www.gravatar.com/avatar/a7723d411779f7a8db4d4ada86a92daa",
        matches: [],
        percent: 27
      },
      {
        commits: 2,
        username: "Mason Woodford",
        email: "mwoodfor@ucsc.edu",
        avatar:
          "https://www.gravatar.com/avatar/48c53c7f87a7243c1df2418a0391c475",
        matches: [],
        percent: 0
      },
      {
        commits: 2,
        username: "KaTLaz",
        email: "65902811+KaTLaz@users.noreply.github.com",
        avatar:
          "https://www.gravatar.com/avatar/9b96229f443b3b44397d6ae23ec8dda5",
        matches: [],
        percent: 0
      },
      {
        commits: 2,
        username: "pimpannt",
        email: "pimpannt@gmail.com",
        avatar:
          "https://www.gravatar.com/avatar/a540af6d867afaba29f28b5a7bfbc375",
        matches: [],
        percent: 0
      }
    ];
    expect(result).toEqual(expectedResult);
  });
});
