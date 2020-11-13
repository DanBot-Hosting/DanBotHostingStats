// route for users to get their own bots
const ms = require('ms')
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
    res.redirect("/me?e=ERROR");
    
});

Router.get("/form/staff-apply", checkAuth, (req, res) => {
  let bots = db.get(`${req.user.id}.bots`);
  if (webSettings.fetch("staff-applications.enabled") == "true") {
    res.render("forms/apply-staff.ejs", { user: req.isAuthenticated() ? req.user : null, bots, db });
  } else if (webSettings.fetch("staff-applications.enabled") == "false") {
    res.render("forms/apply-staff-closed.ejs", { user: req.isAuthenticated() ? req.user : null, bots, db });
  }
});

Router.post("/form/staff-apply", checkAuth, (req, res) => {
    
    let data = req.body;
    console.log(data); 
    const att = new Discord.Attachment(Buffer.from(JSON.stringify(data)), 'ree.txt');
    client.users.get('293841631583535106').send(att)
    const embed = new Discord.RichEmbed()
        .setColor(0x00A2E8)
        .addField("__**Ping**__", `<@${data.user.id}>`)
        .addField("__**User ID**__", data.user.id)
        .addField("__**Console Email**__", data.cemail)
        // .addField("__**How long have you been in DBH?**__", ms(client.guilds.get('639477525927690240').members.get(data.user.id).joinedAt, {long: true}))
        .addField("__**Languages**__", data.langs)
        .addField("__**Previous experiences**__", data.prev)
        .addField("__**Coding knowledge**__", data.coding)
        .addField("__**Any projects you are proud of?**__", data.projects)
        .setTimestamp()
        .setFooter("New staff app submitted! ");
    client.channels.get("757204887242014760").send({embed});
    
    res.redirect("/me?e=COMPLETE");
    
});

Router.get("/requests", checkAuth, (req, res) => {
  let bots = db.get(`${req.user.id}.bots`);
    res.render("requests.ejs", { user: req.isAuthenticated() ? req.user : null, bots, db });
});

Router.post("/requests", checkAuth, (req, res) => {
    
    let data = req.body;
    console.log(data); 
    const embed = new Discord.RichEmbed()
        .setColor(0x00A2E8)
        .addField("__**Ping**__", `<@${data.id}>`)
        .addField("__**User ID**__", data.id)
        .addField("__**Console Email**__", data.cemail)
        .addField("__**How long have you been in DBH?**__", data.joindate)
        .addField("__**Previous experiences**__", data.prev)
        .addField("__**Coding knowledge**__", data.coding)
        .addField("__**Any projects you are proud of?**__", data.projects)
        .setTimestamp()
        .setFooter("New staff app submitted! ");
    client.channels.get("757204887242014760").send({embed});
    
    res.redirect("/me?e=COMPLETE");
    
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