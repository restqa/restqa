import http from "http";

const {PORT = 8887} = process.env;

http
  .createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        hello: "world"
      })
    );
  })
  .listen(PORT, () => {
    console.log("Server running on the port %s", PORT); // eslint-disable-line no-console
  });
