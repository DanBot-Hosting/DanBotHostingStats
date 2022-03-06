// api stuff for bots to submit their stats

const Router = require("express").Router();
const db = require("quick.db");
const isSnowflake = require(process.cwd() + "/util/isSnowflake.js");
const passport = require("passport");
let Developers = ["137624084572798976"];
const rateLimitt = require('express-rate-limit');

var axios = require("axios");
const { compile } = require("ejs");

var nodeIPS = ["176.31.203.20", "176.31.203.21", "176.31.203.22", "176.31.203.23", "176.31.203.24", "176.31.203.25", "173.208.153.242", "192.95.42.70", "192.95.42.73"];

const botPostLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 15, // Limit each IP to 15 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const limitMap = new Map();

const checkRateLimit = async (owner, windowMs, max) => {
    let requestData = limitMap.get(owner);
    if (!requestData) requestData = { start: Date.now(), requestCount: 0, sentAbuseLog: false }; 
    requestData.requestCount++;

    if ( Date.now() < (requestData.start + windowMs)) { //If in last rate limit
        if ( requestData.requestCount >= max ) {
            if (!requestData.sentAbuseLog) {
                const logTo = await client.channels.fetch('927594428766511124');
                logTo.send(`[BOT POST STATS] <@${owner}> has send more requests than ${max} in the last ${windowMs}MS!`);
                requestData.sentAbuseLog = true;
            };
            limitMap.set(owner, requestData);
            return false;
        };
    } else {
        requestData = { start: Date.now(), requestCount: 0, sentAbuseLog: false }; 
    };
    limitMap.set(owner, requestData);
    return true;
};

Router.post("/bot/:ID/stats", async (req, res) => {
   
    
    try {
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
                console.log(owner);

                const rateLimitChekup = await checkRateLimit(owner, 5 * 60 * 1000, 10);
                if (!rateLimitChekup) return res.status(400).json({error: true, message: "You have been rate-limated! Try again later!"});

                console.log(req.body);

                let info;
                try {
                    info = db.get(data.id); 
                } catch (error) {
                    return res.status(400).json({error: true, message: "Invalid bot ID!"});
                };
                
                if (!Number.isInteger(data.servers) || data.servers <= 0)
                   return res
                    .status(400)
                    .send({
                        error: true,
                        message: "'servers' must be a positive integer.",
                    });
                if (!Number.isInteger(data.users) || data.users <= 0)
                    return res
                        .status(400)
                        .send({ error: true, message: "'users' must be a positive integer." });

                console.log(chalk.magenta('[API] ') + chalk.green(`${data.id} just submitted stats`));

                if (info !== null) {
                    if (info.owner != owner) {
                        console.log(chalk.red(`A bot with a diffrent owner just reied to post! ${owner}`));
                        return res.status(400).json({error: true, message: "You do not own this bot!"})
                    };
                    
                    let botName = client.users.cache.get(ID);
                    if(!botName) botName = await client.users.fetch(ID);
                    
                    if (!botName.bot) return res.status(400).send({ error: true, message: "This is a user, not a bot." });

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
                    const logTo = await client.channels.fetch('927292920023904266');
                    
                    let botName = client.users.cache.get(data.id);
                    
                    if(!botName) botName = await client.users.fetch(data.id);

                    if (!botName.bot) {
                        console.log(chalk.red(`${owner} Tried to claim a user!`));
                        logTo.send(`${owner} Tried to claim a user!`);
                        return res.status(401).json({error: true, message: "You do not own this bot!"})
                    };

                    const lastClaim = lastBotClaim.get(owner) || 0;
                    if (Date.now() < (lastClaim + (1000 * 60 * 60 * 24))) {
                        return res.status(401).json({error: true, message: "You can only claim one bot a day!"})
                    };
                    lastBotClaim.set(owner, Date.now());

                    logTo.send(`${owner} has just claimed ${data.id} ${botName.tag}`);

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
        
    } catch (e) {
        console.log(e)
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
