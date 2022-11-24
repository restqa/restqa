const express = require("express");
const got = require("got");

const PORT = process.env.PORT;
express()
  .get("/info", async (req, res) => {
    let url = `${process.env.GITHUB_API || "https://api.github.com"}/status`;
    if (req.query.foo) {
      url += "?match=query";
    }
    const {body, statusCode} = await got.get(url, {
      responseType: "json"
    });
    res.status(statusCode).json(body);
  })
  .listen(PORT, () => {
    console.log(`server is running on port ${PORT}`); // eslint-disable-line no-console
  });
