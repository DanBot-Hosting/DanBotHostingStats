const Router = require("express").Router();

Router.get("/", (req, res) => {

    res.json({ error: false, msg: "DanBot Hosting beta API and Animal API" });

});


Router.get("/stats", (req, res) => {
  try {
    let data = {
      Node1: nodeData.fetch('Node1'),
      Node2: nodeData.fetch('Node2'),
      Node3: nodeData.fetch('Node3'),
      Node4: nodeData.fetch('Node4'),
      Node5: nodeData.fetch('Node5'),
      Node6: nodeData.fetch('Node6'),
      Node7: nodeData.fetch('Node7'),
      Node8: nodeData.fetch('Node8'),
      Node9: nodeData.fetch('Node9'),
      Node10: nodeData.fetch('Node10'),
      Node11: nodeData.fetch('Node11'),
      Node12: nodeData.fetch('Node12'),
      Node13: nodeData.fetch('Node13'),
      Node14: nodeData.fetch('Node14')
    }

    res.json({ error: false, data: data });
  } catch (e) {
    res.json({ error: true, message: e });
  }
});

Router.use("*", (err, req, res) => {
  res
    .json({ error: true, status: 404, message: "Endpoint not found" });
});

module.exports = Router;
