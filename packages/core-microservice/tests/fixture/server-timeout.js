/**
 * In this fixture we will:
 * 1. spin up a server on the wrong port
 * 2. then test should fail due to timeout
 */
const Express = require("express");

const port = parseInt(process.env.PORT) + 1;

Express().listen(port, () => {
  setTimeout(() => process.exit(0), 3000); // Exit after 3s in order to prevent orphan processess
  console.log("server running on port %i", port); // eslint-disable-line no-console
});
