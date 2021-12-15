// api stuff for bots to submit their stats

const Router = require("express").Router();
const db = require("quick.db");
const isSnowflake = require(process.cwd() + "/util/isSnowflake.js");
const passport = require("passport");
let Developers = ["137624084572798976"];
const rateLimitt = require('express-rate-limit');

var axios = require("axios")

var nodeIPS = ["142.54.191.91", "176.31.203.21", "5.39.83.66",
    "178.33.170.233", "178.33.170.232", "5.196.100.232",
    "54.36.224.225", "5.196.100.234", "5.196.100.233",
    "5.196.100.235", "5.196.100.236", "5.196.100.237",
    "5.196.100.238", "5.196.100.239", "137.74.76.69",
    "137.74.76.68", "137.74.76.70", "137.74.76.71", "51.195.252.9", "173.208.153.242", "176.31.203.22"];

Router.post("/bot/:ID/stats", /* rateLimit(10000, 2) , */ (req, res) => { // temp remove if ratelimit
    let ID = req.params.ID;
    if (!ID)
        return res
            .status(400)
            .send({error: true, message: "Please give a bot ID"});

    if (!isSnowflake(ID)) {
        return res
            .status(400)
            .send({error: true, message: "'bot_id' must be a snowflake"});
    }

    let data = req.body;
    let keys = db.get("apiKeys");

    if (keys.includes(data.key)) {
        if (nodeIPS.includes(req.headers["cf-connecting-ip"] || req.headers["x-forwarded-for"] || req.ip)) {
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

                /*   db.fetch(`botIDs`)
          db.push("botIDs", `${ID}`);
       */

                let ids = db.get("bot.IDs");
                if (!ids.includes(ID)) {
                    db.push("bot.IDs", `${ID}`);
                }

                let bots = db.get(`${owner}.bots`);

                if (bots) {

                    if (!bots.includes(ID)) {
                        db.push(`${owner}.bots`, `${ID}`);
                    }

                } else {
                    db.push(`${owner}.bots`, `${ID}`);
                }

                return res
                    .status(200)
                    .send({error: false, message: "Bot stats have been recorded"});
            }
        } else {
            console.log(chalk.red(data.id + ' is not hosted on DBH, Banning...'))
            //client.guilds.cache.get("639477525927690240").members.cache.get(data.id).ban({reason: "bot not hosted on DBH"}).catch(err => { return; })
            return res.status(400).send({ error: true, message: `${data.id} is not hosted on DBH` })
        }




    } else {
        return res
            .status(400)
            .send({error: true, message: "The API Key you gave is invalid"});
    }
});

Router.get("/bot/:ID/info", rateLimit(15000, 4), (req, res) => {
    let ID = req.params.ID;
    if (!ID)
        return res
            .status(400)
            .send({error: true, message: "Please give a bot ID"});

    if (!isSnowflake(ID)) {
        return res
            .status(400)
            .send({error: true, message: "'bot_id' must be a snowflake"});
    }

    let bot = db.get(`${ID}`);
    if (!bot)
        return res.status(400).send({error: true, message: "bot not found"});

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

Router.get(
    "/callback",
    passport.authenticate("discord", {failureRedirect: "/404"}),
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

/* beta site */

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

        res.json({error: false, data: data});
    } catch (e) {
        res.json({error: true, message: e});
    }
});

Router.use("*", (req, res) => {
    res
        .status(404)
        .json({error: true, status: 404, message: "Endpoint not found"});
});

Router.use("*", (err, req, res) => {
    res
        .status(404)
        .json({error: true, status: 404, message: "Endpoint not found"});
});

module.exports = Router;

function rateLimit(windowMs, max, req, res, next) {
    return rateLimitt({
        windowMs,
        max,
        //	keyGenerator: req.header("x-forwarded-for") || req.connection.remoteAddress,
        handler: function (req, res) {
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
