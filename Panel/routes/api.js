// api stuff for bots to submit their stats

const Router = require("express").Router();
const db = require("quick.db");
const isSnowflake = require(process.cwd() + "/util/isSnowflake.js");
const passport = require("passport");
let Developers = [ "137624084572798976", "338192747754160138" ];
const rateLimitt = require('express-rate-limit');

var axios = require("axios")


Router.post("/bot/:ID/stats", /* rateLimit(10000, 2) , */ (req, res) => { // temp remove if ratelimit
  let ID = req.params.ID;
  if (!ID)
    return res
      .status(400)
      .send({ error: true, message: "Please give a bot ID" });

  if (!isSnowflake(ID)) {
    return res
      .status(400)
      .send({ error: true, message: "'bot_id' must be a snowflake" });
  }

  let data = req.body;
  let keys = db.get("apiKeys");

  if (keys.includes(data.key)) {
    let owner = db.get(`${data.key}`);
   // console.log(data);
    let info = db.get(data.id);
    
    console.log(chalk.magenta('[API] ') + chalk.green(`${data.id} just submitted stats`));

    if (info) {
      let botData = {
        id: data.id,
        keyLastUsed: data.key,
        servers: data.servers,
        users: data.users,
        owner: owner,
        client: data.clientInfo,
        deleted: info.deleted,
        added: info.added,
        status: info.status || "N/A",
        mbl: info.mbl || [],
        lastPost: Date.now()
      };

      db.set(ID, botData);
    } else {
      let botData = {
        id: data.id,
        keyLastUsed: data.key,
        servers: data.servers,
        users: data.users,
        owner: owner,
        client: data.clientInfo,
        deleted: false,
        added: Date.now(),
        status: "N/A",
        mbl: [],
        lastPost: Date.now()
      };

      db.set(ID, botData);
    }
    
    
 /*   db.fetch(`botIDs`)
    db.push("botIDs", `${ID}`); 
 */
 
 let ids = db.get("bot.IDs");
 if(!ids.includes(ID)) {
    db.push("bot.IDs", `${ID}`);
 }

 let bots = db.get(`${owner}.bots`);
 
 if(bots) {
 
 if(!bots.includes(ID)) {
    db.push(`${owner}.bots`, `${ID}`);
 }
 
 } else {
    db.push(`${owner}.bots`, `${ID}`); 
 }
 
    return res
      .status(200)
      .send({ error: false, message: "Bot stats have been recorded" });
  } else {
    return res
      .status(400)
      .send({ error: true, message: "The API Key you gave is invalid" });
  }
});

Router.get("/bot/:ID/info", rateLimit(15000, 4), (req, res) => {
  let ID = req.params.ID;
  if (!ID)
    return res
      .status(400)
      .send({ error: true, message: "Please give a bot ID" });

  if (!isSnowflake(ID)) {
    return res
      .status(400)
      .send({ error: true, message: "'bot_id' must be a snowflake" });
  }

  let bot = db.get(`${ID}`);
  if (!bot)
    return res.status(400).send({ error: true, message: "bot not found" });
    
  let data = {
    id: bot.id,
    servers: bot.servers,
    users: bot.users,
    owner: bot.owner,
    client: bot.client,
    deleted: bot.deleted,
    added: bot.added
  };

  res.json(data);
});

Router.get("/bots", rateLimit(15000, 4), (req, res) => {
    
    let bots = db.get("bot.IDs");
    
    res.json(bots);
});

Router.get("/astrobot/stats", async (req, res) => {
  
  axios.get('https://astrobot.org/api/stats', {
  })
  .then(function (response) {
    res.json(response.data);
  }).catch(function (error) {
    console.log(error);
    let sample = {
    "error": false,
    "data": {
        "servers": 0,
        "users": 0,
        "chartsCreated": 0,
        "node": 0,
        "discordJS": 0
    }
}
    res.json(sample)
  })
  
});

Router.get(
  "/callback",
  passport.authenticate("discord", { failureRedirect: "/404" }),
  (req, res) => {
    console.log(`Testing: ` + req.query.state);
    //  addUser(req.user);
    if (Developers.includes(req.user.id)) {
      req.session.isAdmin = true;
    } else {
      req.session.isAdmin = false;
    }
    res.redirect("/me");
    
    //maybe future features.
    
  }
);

Router.use("*", (req, res) => {
  res
    .status(404)
    .json({ error: true, status: 404, message: "Endpoint not found" });
});

Router.use("*", (err, req, res) => {
  res
    .status(404)
    .json({ error: true, status: 404, message: "Endpoint not found" });
});

module.exports = Router;

function rateLimit(windowMs, max, req, res, next) {
  return rateLimitt({
    windowMs,
    max,
    //	keyGenerator: req.header("x-forwarded-for") || req.connection.remoteAddress,
    handler: function(req, res) {
      return res
        .status(429)
        .json({
          error: true,
          code: 429,
          message: "DanBot Hosting Stats API - You are sending too many requests, please slow down"
        });
    }
  });
}
