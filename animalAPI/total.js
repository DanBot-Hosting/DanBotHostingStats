const fs = require("fs");
const Router = require("express").Router();

Router.get("/", (req, res) => {
  var dogfiles = fs.readdirSync("./animalAPI/dog");
  var catfiles = fs.readdirSync("./animalAPI/cat");
  let data = {
    dogtotal: dogfiles.length,
    cattotal: catfiles.length,
  };

  res.json(data);
});

module.exports = Router;
