const Tools = {
  swagger: require("./swagger")
};

/**
 * Generate a test scenario from a curl command
 *
 * @param {string} tool -
 * @param {object} info -
 * @param {string} info.version -
 * @param {string} info.title -
 * @param {string} info.description -
 * @param {object} tags -
 * @param {array}  matches -
 * @param {object} excludes -
 * @param {array}  excludes.routes -
 * @param {array}  excludes.queries -
 * @param {object} headers -
 * @param {array}  headers.request -
 * @param {array}  headers.response -
 *
 * @return Array<obj>
 *
 * @example
 *
 * const Specification = require('@restqa/specification')
 *
 * const options = {
 *   tool: 'swagger'
 *   info: {
 *     version: '0.0.1',
 *     title: 'My service'
 *     description: 'The beauty of an amazing project'
 *   },
 *   tags: {
 *   },
 *   matches: [
 *   ],
 *   excludes: {
 *     paths: [
 *     ],
 *     queries: [
 *     ]
 *   },
 *   headers: {
 *     request: [
 *     ],
 *     response: [
 *     ]
 *   }
 * }
 *
 * const instance = new Specification(options)
 * const api = {
 *   request:{
 *     ...
 *   }
 *   response {
 *     ...
 *   }
 * }
 * instance.add(api)
 * const result = instance.format()
 */
class Specification {
  constructor(options = {}) {
    let {tool} = options;

    tool = tool || "swagger";

    const tools = Object.keys(Tools);
    if (tools.includes(tool) === false) {
      throw new Error(
        `The specification property "tool" should be specify. (available: ${tools.join(
          ","
        )})`
      );
    }
    this._options = options;
    this._instance = new Tools[tool](this._options);
  }

  get instance() {
    return this._instance;
  }

  add(api) {
    return this.instance.add(api);
  }

  format() {
    return this.instance.format();
  }
}

module.exports = Specification;
