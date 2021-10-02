const generate = require("./cli/generate");
const install = require("./cli/install");
const steps = require("./cli/steps");
const run = require("./cli/run");
const dashboard = require("./cli/dashboard");
const initialize = require("./cli/initialize");
const HttpsServer = require("./http-server");
const Sandbox = require("./core/sandbox");

const Stream = require("stream");

/**
 * Initialize a restqa project
 *
 * @param {Object} options
 * @param {string} options.name - The name of the project
 * @param {string} options.description - The description of the project
 * @param {string} options.env - The default environment of your project
 * @param {string} options.url - The api url of the current environement
 * @param {options} (optional) options.ci - Continuous integration tool that required to be setup
 * @param {options} (optional) options.folder - Define the folder where to initiate restqa
 *
 * @return String - path of the configuration file
 *
 * @example
 *
 * const { Initialize } = require('@restqa/restqa')
 *
 * const options = {
 *   name: 'my application',
 *   description: 'This application is used for sample',
 *   env: 'local',
 *   url: 'https://api.example.com',
 *   ci: 'github-action',
 *   folder: './integration-tests'
 * }
 *
 * const result = await Initialize(options)
 * console.log(result)
 */
async function Initialize(options) {
  return initialize.generate(options);
}

/**
 * Generate a test scenario from a curl command
 *
 * @param {string} The curl command that need to be converted as a scenario
 *
 * @return Array<obj>
 *
 * @example
 *
 * const { Generate } = require('@restqa/restqa')
 *
 * const cmd = "curl -X GET https://jsonplaceholder.typicode.com/todos/1"
 *
 * const result = await Generate(cmd)
 * console.log(result)
 */
async function Generate(cmd) {
  const args = cmd
    .match(/"[^"]+"|'[^']+'|\S+/g)
    .map((str) => str.replace(/^"/, "").replace(/"$/, ""));

  const options = {
    print: false
  };

  return generate(options, {args});
}

/**
 * Install a new integration into your configuration
 *
 * @param {Object} options
 * @param {string} option.name - The name of the integration you want to install (ex: 'slack')
 * @param {string} option.configFile - Location of the RestQA Configuration File (ex: './restqa.yml')
 * @param {string} option.env - The target enviironment (from your RestQA config file) (ex: 'local')
 * @param {options} option.config - Represent the configuration required to setup the addon
 *
 * @return Array<obj>
 *
 * @example
 *
 * const { Install } = require('@restqa/restqa')
 *
 * const options = {
 *   name: 'discord',
 *   configFile: './restqa.yml',
 *   env: 'prod',
 *   config: {
 *     url: 'http://webhook.discord.com/test'
 *   }
 * }
 *
 * const result = await Install(options)
 * console.log(result)
 */
function Install(options) {
  return install.generate(options);
}

/**
 * Retrieve the list of step definition available
 *
 * @param {Object} options
 * @param {string} options.keyword - The path of the RestQA configuration file (given | then | when)
 * @param {string} options.configFile - The path of the RestQA configuration file
 * @param {string} options.env - The target environment from the RestQA configuration file
 * @param {string} options.tags - The tag used to filter the steps
 *
 * @return Array<obj>
 *
 * @example
 *
 * const { Steps } = require('@restqa/restqa')
 *
 * const options = {
 *   keyword: 'given',
 *   configFile: './restqa.yml',
 *   env: 'prod',
 *   tags: 'headers'
 * }
 *
 * const result = Steps(options)
 * console.log(result)
 */
function Steps(options) {
  return steps(options.keyword, {
    config: options.configFile || "./.restqa.yml",
    tag: options.tag,
    print: false
  });
}

/**
 * Execute RestQA test suite using specific configuration
 *
 * @param {Object} options
 * @param {string} options.configFile - The path of the RestQA configuration file
 * @param {string} options.env - The target environment from the RestQA configuration file
 * @param {stream.Writable} options.stream - The stream to export the logs
 * @param {array} options.tags - The list of tags
 * @param {string} options.path - The path of the feature files
 *
 * @return Promise<obj>
 *
 * @example
 *
 * const { Run } = require('@restqa/restqa')
 *
 * const options = {
 *   configFile: './restqa.yml',
 *   env: 'prod',
 *   stream: process.stdout,
 *   tags: [
 *     '@production',
 *     '@success'
 *   ],
 *   path: './tests'
 * }
 *
 * const result = await Run(options)
 * console.log(result)
 */

function Run(options) {
  let result;
  const optStream = {
    write: (chunk, encoding, next) => {
      result = JSON.parse(chunk.toString("utf-8"));
      next();
    }
  };
  const stream = new Stream.Writable(optStream);
  global.restqa = global.restqa || {};
  global.restqa.tmpExport = stream;

  let args;

  if (options.path) {
    args = [options.path];
  }

  return run({
    config: options.configFile,
    env: options.env,
    stream: options.stream,
    tags: options.tags || [],
    args
  })
    .then(() => {
      return result;
    })
    .finally(() => {
      delete require.cache[require.resolve("./restqa-formatter.js")];
      delete require.cache[require.resolve("./setup.js")];
    });
}

/**
 * Expose the RestQA Dashboard using a specific configuration
 *
 * @param {Object} options
 * @param {string} options.configFile - The path of the RestQA configuration file
 * @param {string} (optional) options.folder - Define the folder where to project is located
 * @param {string} (optional) options.readOnly - Restrict the access to the feature file into read only
 *
 * @return http.server
 *
 * @example
 *
 * const { Dashboard } = require('@restqa/restqa')
 *
 * const options = {
 *   configFile: './restqa.yml',
 *   folder: '/app/project',
 *   readOnly: true
 * }
 *
 * const server = Dashboard(options)
 * server.listen(8000, () => {
 *   console.log('The dashboard is running on the port 8000')
 * })
 */

function Dashboard(options) {
  const opt = {
    config: options.configFile,
    folder: options.folder,
    serve: false
  };
  return dashboard(opt);
}

/**
 * Expose middleware for Express and Fastify
 *
 * @param {Object} options
 * @param {string} options.configFile - The path of the RestQA configuration file
 * @param {string} (optional) options.folder - Define the folder where to project is located
 * @param {string} (optional) options.readOnly - Restrict the access to the feature file into read only
 * @param {string} (optional) options.route - Route used to exposed the dashboard (default: '/restqa')
 *
 * @return http.server
 *
 * @example
 *
 * const express = require('express')
 * const { Hooks } = require('@restqa/restqa')
 *
 * const options = {
 *   configFile: './restqa.yml',
 *   folder: '/app/project',
 *   readOnly: true,
 *   route: '/restqa'
 * }
 *
 * const server = express()
 * Hooks.express(server, options)
 * server.listen(8000, () => {
 *   console.log('The Microservice is running on the port 8000')
 * })
 */
const Hooks = {
  express: function (server, options) {
    options.route = options.route || "/restqa";
    options.sandbox = options.sandbox || new Sandbox();
    options.serve = false;
    server
      .use(options.route, HttpsServer(options.configFile, options))
      .use((req, res, next) => {
        const buffers = [];
        const proxyHandler = {
          apply(target, thisArg, argumentsList) {
            const contentType = res.getHeader("content-type");
            if (
              typeof contentType === "string" &&
              contentType.includes("json") &&
              argumentsList[0]
            ) {
              buffers.push(argumentsList[0]);
            }
            return target.call(thisArg, ...argumentsList);
          }
        };
        res.write = new Proxy(res.write, proxyHandler);
        res.end = new Proxy(res.end, proxyHandler);
        res.on("finish", function () {
          if (req.path.startsWith(options.route)) return;

          // tracing logic inside
          const response = {
            headers: this.getHeaders(),
            status: this.statusCode,
            body: Buffer.concat(buffers).toString("utf-8")
          };

          delete response.headers.etag;

          if ((response.headers["content-type"] || "").includes("json")) {
            response.body = JSON.parse(response.body);
          }

          const request = {
            path: req.path,
            method: req.method,
            query: req.query,
            headers: req.headers,
            body: req.body
          };

          const msg = {
            request,
            response
          };
          options.sandbox.emit("request", msg);
        });
        next();
      });
    return server;
  }
};

module.exports = {
  Initialize,
  Generate,
  Install,
  Steps,
  Dashboard,
  Run,
  Hooks
};
