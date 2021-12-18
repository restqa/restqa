const generate = require("./cli/generate");
const steps = require("./cli/steps");
const run = require("./cli/run");
const dashboard = require("./cli/dashboard");

const Stream = require("stream");


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
    args,
    skipInit: options.skipInit
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
 * @example Express
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
 *
 * @example Fastify
 *
 * (async function() {
 * const fastify = require('fastify')
 * const { Hooks } = require('@restqa/restqa')
 *   const opt = {
 *     configFile: __dirname + './restqa.yml',
 *     folder: '/app/project',
 *     readOnly: true,
 *     route: '/restqa'
 *   };
 *   const app = fastify({ logger:false});
 *   await  app.register(Hooks.fastify, opt);
 *   app.get("/hello", () => {
 *     return {
 *       message: 'hello'
 *     };
 *   });
 *
 *   await app.listen(8083);
 * })()
 */
//const Hooks = require("./hooks");

module.exports = {
  Generate,
  Steps,
  //Dashboard,
  Run,
  //Hooks
};
