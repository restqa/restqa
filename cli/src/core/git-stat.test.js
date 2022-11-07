const jestqa = new JestQA(__filename, true);

beforeEach(jestqa.beforeEach);
afterEach(jestqa.afterEach);

describe("# git-stat", () => {
  test("return empty array if the .git folder is not detected", async () => {
    const gitStat = require("./git-stat");
    const options = {
      path: __dirname
    };

    const result = await gitStat(options);
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

    const gitStat = require("./git-stat");
    const result = await gitStat();
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

    const gitStat = require("./git-stat");
    const result = await gitStat();
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

    jest.mock("fs", () => {
      return {
        existsSync: () => true
      };
    });

    const gitStat = require("./git-stat");
    const result = await gitStat();
    const expectedResult = [
      {
        commits: 579,
        username: "Olivier",
        email: "hi@olivierodo.me",
        avatar:
          "https://www.gravatar.com/avatar/6b262c3874c116f42b3a7abf26b9dc5b",
        matches: ["OliverOdo", "Olivier Rodomond", "OliverOdo"]
      },
      {
        commits: 176,
        username: "tony-go",
        email: "gorez.tony@gmail.com",
        avatar:
          "https://www.gravatar.com/avatar/a7723d411779f7a8db4d4ada86a92daa",
        matches: ["Tony Gorez"]
      },
      {
        commits: 23,
        username: "dependabot[bot]",
        email: "49699333+dependabot[bot]@users.noreply.github.com",
        avatar:
          "https://www.gravatar.com/avatar/48ea49be76d0c68403a7f3df87e3487d",
        matches: []
      },
      {
        commits: 2,
        username: "Mason Woodford",
        email: "mwoodfor@ucsc.edu",
        avatar:
          "https://www.gravatar.com/avatar/48c53c7f87a7243c1df2418a0391c475",
        matches: []
      },
      {
        commits: 2,
        username: "KaTLaz",
        email: "65902811+KaTLaz@users.noreply.github.com",
        avatar:
          "https://www.gravatar.com/avatar/9b96229f443b3b44397d6ae23ec8dda5",
        matches: []
      },
      {
        commits: 2,
        username: "pimpannt",
        email: "pimpannt@gmail.com",
        avatar:
          "https://www.gravatar.com/avatar/a540af6d867afaba29f28b5a7bfbc375",
        matches: []
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

    const gitStat = require("./git-stat");
    const result = await gitStat();
    const expectedResult = [
      {
        commits: 456,
        username: "Olivier",
        email: "hi@olivierodo.me",
        avatar:
          "https://www.gravatar.com/avatar/6b262c3874c116f42b3a7abf26b9dc5b",
        matches: []
      },
      {
        commits: 175,
        username: "tony-go",
        email: "gorez.tony@gmail.com",
        avatar:
          "https://www.gravatar.com/avatar/a7723d411779f7a8db4d4ada86a92daa",
        matches: []
      },
      {
        commits: 2,
        username: "Mason Woodford",
        email: "mwoodfor@ucsc.edu",
        avatar:
          "https://www.gravatar.com/avatar/48c53c7f87a7243c1df2418a0391c475",
        matches: []
      },
      {
        commits: 2,
        username: "KaTLaz",
        email: "65902811+KaTLaz@users.noreply.github.com",
        avatar:
          "https://www.gravatar.com/avatar/9b96229f443b3b44397d6ae23ec8dda5",
        matches: []
      },
      {
        commits: 2,
        username: "pimpannt",
        email: "pimpannt@gmail.com",
        avatar:
          "https://www.gravatar.com/avatar/a540af6d867afaba29f28b5a7bfbc375",
        matches: []
      }
    ];
    expect(result).toEqual(expectedResult);
  });
});
