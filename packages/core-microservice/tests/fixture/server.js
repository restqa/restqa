const Express = require("express");

const port = process.env.PORT;

Express().listen(port, () => {
  setTimeout(() => process.exit(0), 3000); // Exit after 3s in order to prevent orphan processess
  console.log("Server running on the port %i", port); // eslint-disable-line no-console
});
