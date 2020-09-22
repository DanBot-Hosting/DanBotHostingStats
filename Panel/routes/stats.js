const Router = require("express").Router();
const db = require("quick.db");
const isSnowflake = require(process.cwd() + "/util/isSnowflake.js");

Router.get("/", (req, res) => {

  //Data for node 1
  var N1 = fs.readFileSync('././data/Node1.json', 'utf8');
  var Node1 = JSON.parse(N1);
  var N1speed = fs.readFileSync('././data/Node1-speedtest.json', 'utf8');
  var Node1speed = JSON.parse(N1speed);

  //Data for node 2
  var N2 = fs.readFileSync('././data/Node2.json', 'utf8');
  var Node2 = JSON.parse(N2);
  var N2speed = fs.readFileSync('././data/Node2-speedtest.json', 'utf8');
  var Node2speed = JSON.parse(N2speed);
 
  //Data for node 3
  var N3 = fs.readFileSync('././data/vmi450443.contaboserver.net.json', 'utf8');
  var Node3 = JSON.parse(N3);
  var N3speed = fs.readFileSync('././data/vmi450443.contaboserver.net-speedtest.json', 'utf8');
  var Node3speed = JSON.parse(N3speed);

  res.render('index.ejs',  { layout: false,
    Node1Data: Node1,
    Node2Data: Node2,
    Node3Data: Node3,
    Node1DataSpeed: Node1speed,
    Node2DataSpeed: Node2speed,
    Node3DataSpeed: Node3speed,
    user: req.isAuthenticated() ? req.user : null
});
});

Router.get("/Node1", (req, res) => {

  //Data for node 1
  var N1 = fs.readFileSync('././data/Node1.json', 'utf8');
  var Node1 = JSON.parse(N1);
  var N1speed = fs.readFileSync('././data/Node1-speedtest.json', 'utf8');
  var Node1speed = JSON.parse(N1speed);

  res.render('node1.ejs',  { layout: false,
    Node1Data: Node1,
    Node1DataSpeed: Node1speed,
    user: req.isAuthenticated() ? req.user : null
});
});

Router.get("/Node2", (req, res) => {

  //Data for node 2
  var N2 = fs.readFileSync('././data/Node2.json', 'utf8');
  var Node2 = JSON.parse(N2);
  var N2speed = fs.readFileSync('././data/Node2-speedtest.json', 'utf8');
  var Node2speed = JSON.parse(N2speed);

  res.render('node2.ejs',  { layout: false,
    Node2Data: Node2,
    Node2DataSpeed: Node2speed,
    user: req.isAuthenticated() ? req.user : null
});
});

Router.get("/Node3", (req, res) => {

  //Data for node 3
  var N3 = fs.readFileSync('././data/vmi450443.contaboserver.net.json', 'utf8');
  var Node3 = JSON.parse(N3);
  var N3speed = fs.readFileSync('././data/vmi450443.contaboserver.net-speedtest.json', 'utf8');
  var Node3speed = JSON.parse(N3speed);

  res.render('node3.ejs',  { layout: false,
    Node3Data: Node3,
    Node3DataSpeed: Node3speed,
    user: req.isAuthenticated() ? req.user : null
});
});

module.exports = Router;