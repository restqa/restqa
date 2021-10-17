const expressHook = require("./express");

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
module.exports = {
  express: expressHook
}