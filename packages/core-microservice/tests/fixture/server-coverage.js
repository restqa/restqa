/**
 * In this fixture we will:
 * 1. spin up a server
 * 3. print the NODE_V8_COVERAGE environment variable in the console
 *
 */
const Express = require("express");

const port = process.env.PORT;

Express().listen(port, () => {
  setTimeout(() => process.exit(0), 3000); // Exit after 3s in order to prevent orphan processess
  // eslint-disable-next-line no-console
  console.log(
    `received the environemet variable NODE_V8_COVERAGE=${process.env.NODE_V8_COVERAGE}`
  );
});
