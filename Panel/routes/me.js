// route for users to get their own bots

const Router = require("express").Router();
const db = require("quick.db");
const isSnowflake = require(process.cwd() + "/util/isSnowflake.js");

Router.get("/", checkAuth, (req, res) => {
  let bots = db.get(`${req.user.id}.bots`);
  res.render("me/index.ejs", { user: req.isAuthenticated() ? req.user : null, bots, db });
});

Router.get("/form/new-server", checkAuth, (req, res) => {
  let bots = db.get(`${req.user.id}.bots`);
  res.render("forms/newserver.ejs", { user: req.isAuthenticated() ? req.user : null, bots, db });
});

Router.post("/form/new-server", checkAuth, (req, res) => {
    
    let data = req.body;
    console.log(data); 
//{ id: '137624084572798976', name: 'test', type: 'NodeJS', ssubm: '' }
    if(data.type == "NodeJS") {
      console.log('Lmao nodejs')
    }
    
    res.redirect("/me?e=ERROR");
    
});

Router.get("/form/staff-apply", checkAuth, (req, res) => {
  let bots = db.get(`${req.user.id}.bots`);
  res.render("forms/apply-staff.ejs", { user: req.isAuthenticated() ? req.user : null, bots, db });
});

Router.post("/form/staff-apply", checkAuth, (req, res) => {
    
    let data = req.body;
    console.log(data); 
//{ id: '137624084572798976', name: 'test', type: 'NodeJS', ssubm: '' }
    if(data.type == "NodeJS") {
      console.log('Lmao nodejs')
    }
    
    res.redirect("/me?e=ERROR");
    
});

module.exports = Router;

/*
 * Authorization check, if not authorized return them to the login page.
 */
function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.session.backURL = req.url;

    res.redirect("/login?redirect=/me");
  }
}