/**
 * In this fixture we will:
 * 1. spin up a server
 * 2. filter the received environment variable starting with TEST_
 * 3. print the TEST-* environment variable in the console
 *
 */
const Express = require("express");

const port = process.env.PORT;

Express().listen(port, () => {
  setTimeout(() => process.exit(0), 3000); // Exit after 3s in order to prevent orphan processess
  Object.entries(process.env)
    .filter(([key]) => {
      return key.startsWith("TEST_");
    })
    .forEach(([key, value]) => {
      console.log(`received the environemet variable ${key}=${value}`); // eslint-disable-line no-console
    });
});
