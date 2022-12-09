const express = require("express");

const PORT = process.env.PORT;
express()
  .get("/info", async (req, res) => {
    const {
      music
    } = req.query
    res
      .status(200)
      .json({
        music
      });
 })
  .listen(PORT, () => {
    console.log(`server is running on port ${PORT}`); // eslint-disable-line no-console
  });

