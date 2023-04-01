const {exec} = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const fsm = require("fuzzy-string-matching");
const {cwd} = require("./utils/process");

module.exports = function (options = {}) {
  options.path = options.path || cwd;
  return new Promise((resolve, reject) => {

    const cmd = `git shortlog -s -n -e --all --no-merges ${options.path}`;

    exec(cmd, (error, stdout, stderr) => {
      if (error || stderr) return resolve([]);

      const result = [];
      stdout
        .split("\n")
        .map((_) =>
          String(_)
            .trim()
            .match(/^(\d+)\s+(.*)\s{1}<(.*)>$/)
        )
        .filter((match) => match && match[3] !== "null")
        .map((match, index, array) => {
          const [, commits, username, email] = match;
          return {
            commits: Number(commits),
            username,
            email,
            avatar: `https://www.gravatar.com/avatar/${crypto
              .createHash("md5")
              .update(email)
              .digest("hex")}`,
            matches: []
          };
        })
        .forEach((item, index) => {
          if (!result.length) result.push(item);
          result.forEach((match) => {
            if (match.username === item.username && match.email === item.email)
              return;
            if (fsm(match.username, item.username) > 0.2) {
              match.commits += item.commits;
              if (match.username !== item.username) {
                match.matches.push(item.username);
              }
            } else {
              if (!result.map((_) => _.username).includes(item.username)) {
                result.push(item);
              }
            }
          });
        });

      result.forEach((item) => {
        item.matches.forEach((username) => {
          const index = result.findIndex((_) => _.username === username);
          if (index !== -1) {
            result.splice(index, 1);
          }
        });
      });

      const total = result.reduce(
        (result, item) => result + Number(item.commits),
        0
      );
      result.map((item) => {
        item.percent = Math.floor((item.commits / total) * 100);
        return item;
      });

      return resolve(result);
    });
  });
};
