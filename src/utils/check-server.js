const promisifySetTimeout = require("util").promisify(setTimeout);

async function checkServer() {
  await promisifySetTimeout(3000);
}

module.exports = { checkServer };