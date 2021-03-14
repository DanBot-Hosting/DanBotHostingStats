const Router = require("express").Router();
const db = require("quick.db");
const isSnowflake = require(process.cwd() + "/util/isSnowflake.js");

Router.get("/", (req, res) => {
  let items = nodeData.fetch('');
  let filteredItems = items.filter(i => i.state === "running");

  res.render('stats.ejs', {
    table: filteredItems,
    user: req.isAuthenticated() ? req.user : null, bots, db
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
