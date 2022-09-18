const {Command} = require("commander");
const {Generator} = require("@restqa/restqapi");
const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");

module.exports = async function (pOptions, program) {
  const {args} = program;

  let {print} = pOptions;
  if (undefined === print) {
    print = true;
  }

  if (args[0] !== "curl") {
    throw new ReferenceError(
      "You need to provide a curl command for me to generate an awesome scenario"
    );
  }

  try {
    const collect = (value, previous) => previous.concat([value]);
    const curlProgram = new Command();
    curlProgram
      .option(
        "-H, --header <header>",
        "Extra header to include in the request when sending HTTP to a server",
        collect,
        []
      )
      .option(
        "-b, --cookie <cookie>",
        "Pass the data to the HTTP server in the Cookie header"
      )
      .option(
        "-u, --user <user>",
        "Tells curl to use HTTP Basic authentication with the remote host"
      )
      .option(
        "-A, --user-agent <userAgent>",
        "Specify the User-Agent string to send to the HTTP server"
      )
      .option(
        "-X, --request <request>",
        "Specifies a custom request method to use when communicating with the HTTP server"
      )
      .option("--url <url>", "Specify a URL to fetch")
      .option(
        "-F, --form <form>",
        "For HTTP protocol family, this lets curl emulate a filled-in form in which a user has pressed the submit button",
        collect,
        []
      )
      .option(
        "-d, --data <data>",
        "Sends the specified data in a POST request to the HTTP server",
        collect,
        []
      )
      .option(
        "--data-raw <dataRaw>",
        "This posts data similarly to -d, --data ",
        collect,
        []
      )
      .option(
        "--data-binary <dataBinary>",
        "This posts data exactly as specified with no extra processing whatsoever"
      )
      .option("--data-urlencode <dataUrlEncode>", "")
      .option(
        "--compressed",
        "Request a compressed response using one of the algorithms curl supports, and automatically decompress the content"
      )
      .option(
        "-k, --insecure",
        "By default, every SSL connection curl makes is verified to be secure. This option allows curl to proceed and operate even for server connections otherwise considered insecure"
      )
      .option("-o, --output <output>", "Export the scenario output into a file")
      .exitOverride()
      .parse(["runner", ...args]);

    const opt = curlProgram.opts();

    if (curlProgram.args.length === 0 && !opt.url) {
      throw new Error("You need to provide an url into your curl command");
    }

    const options = {
      url: opt.url || curlProgram.args[0]
    };

    if (opt.request) {
      options.method = opt.request;
    }

    opt.header.forEach((item) => {
      options.headers = options.headers || {};
      item = item.split(":");
      const key = item[0];
      const value = item.splice(1).join(":").trim();
      options.headers[key] = value;
    });

    if (opt.user) {
      const [username, password] = opt.user.split(":");
      options.user = {
        username,
        password
      };
    }

    if (opt.insecure) {
      options.ignoreSsl = true;
    }

    options.isJson =
      ((options.headers && options.headers["content-type"]) || "").indexOf(
        "json"
      ) !== -1;

    if (opt.dataBinary) {
      options.method = options.method || "POST";
      if (options.isJson) {
        opt.dataBinary = JSON.parse(opt.dataBinary);
      }
      options.body = opt.dataBinary;
    }

    opt.data.concat(opt.dataRaw).forEach((item) => {
      options.method = opt.request || "POST";
      if (options.isJson) {
        options.body = JSON.parse(item);
      } else {
        options.body = options.body || {};
        item = item.split("=");
        const key = item[0];
        const value = item.splice(1).join("=").trim();
        options.body[key] = value;
      }
    });

    opt.form.forEach((item) => {
      options.method = opt.request || "POST";
      options.form = options.form || {};
      item = item.split("=");
      const key = item[0];
      const value = item.splice(1).join("=").trim();
      options.form[key] = value;
    });

    if (opt.cookie) {
      options.headers = options.headers || {};
      options.headers.cookie = opt.cookie;
    }

    if (opt.userAgent) {
      options.headers = options.headers || {};
      options.headers["user-agent"] = opt.userAgent;
    }

    const result = await Generator(options);

    if (opt.output) {
      const filename = path.resolve(process.cwd(), opt.output);
      const headers = ["Feature: Generated scenario", ""];

      let content = [
        `Scenario: Test on ${options.method || "GET"} ${options.url}`,
        result,
        "\n\n\n\n"
      ];

      if (!fs.existsSync(filename)) {
        content = headers.concat(content);
      }

      fs.appendFileSync(filename, content.join("\n"));
      logger.success("service.generate.output_file_message", opt.output);
    } else if (print === true) {
      logger.success("service.generate.successful_message");
      logger.log(result);
    }

    return result;
  } catch (e) {
    if (e.code === "commander.unknownOption") {
      const flag = e.message.match(/'(.*)'$/)[1];
      throw new Error(`The curl options "${flag}" is not supported`);
    } else {
      throw e;
    }
  }
};
