const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("api running");
});

app.get("/new", (req, res) => {
  res.send("Thos is folder with news");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is running");
});
