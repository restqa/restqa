/*
 * Uppdate: 17/05/21
 * Since RestQA is getting bigger and bigger
 * We should Lazy load the different command module
 * Then avoid to load all the module just for one function.
 * ----
 * Latest benchamark on the command "time  ./bin/restqa steps then -c example/.restqa.yml"
 * Before: 2.977 sec
 * After: 1.281 sec
 */

module.exports = function (module) {
  return async function () {
    const Module = require(`./${module}`);
    return Module.apply(this, arguments);
  };
};
