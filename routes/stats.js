const Router = require("express").Router();
const db = require("quick.db");
const isSnowflake = require(process.cwd() + "/util/isSnowflake.js");

Router.get("/", (req, res) => {
  let n1 = [ nodeData.fetch('Node1') ]
  let n2 = [ nodeData.fetch('Node2') ]
  let n3 = [ nodeData.fetch('Node3') ]
  let n4 = [ nodeData.fetch('Node4') ]
  let n5 = [ nodeData.fetch('Node5') ]
  let n6 = [ nodeData.fetch('Node6') ]
  let n7 = [ nodeData.fetch('Node7') ]
  let n8 = [ nodeData.fetch('Node8') ]
  let n9 = [ nodeData.fetch('Node9') ]
  let n10 = [ nodeData.fetch('Node10') ]
  let n11 = [ nodeData.fetch('Node11') ]
  let n12 = [ nodeData.fetch('Node12') ]
  let n13 = [ nodeData.fetch('Node13') ]
  let n14 = [ nodeData.fetch('Node14') ]
  let data = n1.concat(n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12, n13, n14);
  //console.log(items)
  //var objectValue = JSON.parse(data);
console.log(data)
  res.render('stats.ejs', {
    table: data,
    user: req.isAuthenticated() ? req.user : null
  })
});

Router.get("/all", (req, res) => {

  res.render('index.ejs',  { layout: false,
    user: req.isAuthenticated() ? req.user : null
});
});

Router.get("/Node1", (req, res) => {
  res.render('node1.ejs',  { layout: false,
    user: req.isAuthenticated() ? req.user : null
});
});

Router.get("/Node2", (req, res) => {
  res.render('node2.ejs',  { layout: false,
    user: req.isAuthenticated() ? req.user : null
});
});

Router.get("/Node3", (req, res) => {
  res.render('node3.ejs',  { layout: false,
    user: req.isAuthenticated() ? req.user : null
});
});

Router.get("/Node4", (req, res) => {
  res.render('node4.ejs',  { layout: false,
    user: req.isAuthenticated() ? req.user : null
});
});

module.exports = Router;
