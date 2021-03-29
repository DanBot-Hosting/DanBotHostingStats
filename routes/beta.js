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
      Node14: nodeData.fetch('Node14'),
        
      Node1Status: nodeStatus.fetch('Node1'),
      Node2Status: nodeStatus.fetch('Node2'),
      Node3Status: nodeStatus.fetch('Node3'),
      Node4Status: nodeStatus.fetch('Node4'),
      Node5Status: nodeStatus.fetch('Node5'),
      Node6Status: nodeStatus.fetch('Node6'),
      Node7Status: nodeStatus.fetch('Node7'),
      Node8Status: nodeStatus.fetch('Node8'),
      Node9Status: nodeStatus.fetch('Node9'),
      Node10Status: nodeStatus.fetch('Node10'),
      Node11Status: nodeStatus.fetch('Node11'),
      Node12Status: nodeStatus.fetch('Node12'),
      Node13Status: nodeStatus.fetch('Node13'),
      Node14Status: nodeStatus.fetch('Node14')
        
    }

    res.json({ error: false, data: data });
  } catch (e) {
    res.json({ error: true, message: e });
  }
});

Router.get("*", async function(req, res) {
  res.status(404).send({
    error: true,
    status: 404,
    message: "Endpoint not found"
  });
});

module.exports = Router;
