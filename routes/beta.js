const Router = require("express").Router();

Router.get("/", (req, res) => {

    res.json({ error: false, msg: "DanBot Hosting beta API and Animal API" });
  
});


Router.get("/stats", (req, res) => {
  try {
    let items = nodeData.all();
    var objectValue = JSON.parse(items);

    let filteredItems = objectValue.filter(i => i.ID === "Node");

    res.json({ error: false, data: filteredItems });
  } catch (e) {
    res.json({ error: true, message: e });
  }
});

Router.use("*", (err, req, res) => {
  res
    .status(404)
    .json({ error: true, status: 404, message: "Endpoint not found" });
});

module.exports = Router;
