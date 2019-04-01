const express = require("express");
const bodyParser = require("body-parser");

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "./views/index.html");
});
