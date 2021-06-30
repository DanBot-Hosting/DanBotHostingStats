// api stuff for bots to submit their stats

const Router = require('express').Router();
const db = require('quick.db');
const isSnowflake = require(`${process.cwd()}/util/isSnowflake.js`);
const passport = require('passport');
const Developers = ['137624084572798976', '293841631583535106'];
const rateLimitt = require('express-rate-limit');

var axios = require('axios');

Router.post('/bot/:ID/stats', /* rateLimit(10000, 2) , */ (req, res) => { // temp remove if ratelimit
    const { ID } = req.params;
    if (!ID) {
        return res
            .status(400)
            .send({
                error: true,
                message: 'Please give a bot ID'
            });
        }

    if (!isSnowflake(ID)) {
        return res
            .status(400)
            .send({
                error: true,
                message: '\'bot_id\' must be a snowflake'
            });
        }

    const data = req.body;
    const keys = db.get('apiKeys');

    if (keys.includes(data.key)) {
        const owner = db.get(`${data.key}`);
        // console.log(data);
        const info = db.get(data.id);

        console.log(chalk.magenta('[API] ') + chalk.green(`${data.id} just submitted stats`));

        if (info) {
            const botData = {
                id: data.id,
                keyLastUsed: data.key,
                servers: data.servers,
                users: data.users,
                owner,
                client: data.clientInfo,
                deleted: info.deleted,
                added: info.added,
                status: info.status || 'N/A',
                mbl: info.mbl || [],
                lastPost: Date.now()
            };
            db.set(ID, botData);
        } else {
            const botData = {
                id: data.id,
                keyLastUsed: data.key,
                servers: data.servers,
                users: data.users,
                owner,
                client: data.clientInfo,
                deleted: false,
                added: Date.now(),
                status: 'N/A',
                mbl: [],
                lastPost: Date.now()
            };
            db.set(ID, botData);
        }


        /**
         * db.fetch(`botIDs`)
         * db.push("botIDs", `${ID}`);
         */

        const ids = db.get('bot.IDs');

        if (!ids.includes(ID)) {
            db.push('bot.IDs', `${ID}`);
        }

        const bots = db.get(`${owner}.bots`);

        if (bots) {
            if (!bots.includes(ID)) {
                db.push(`${owner}.bots`, `${ID}`);
            }
        } else {
            db.push(`${owner}.bots`, `${ID}`);
        }

    return res
        .status(200)
        .send({
            error: false,
            message: 'Bot stats have been recorded'
        });
    } else {
        return res
            .status(400)
            .send({
                error: true,
                message: 'The API Key you gave is invalid'
            });
        }
    });

Router.get('/bot/:ID/info', rateLimit(15000, 4), (req, res) => {
    const { ID } = req.params;
    if (!ID) {
    return res
            .status(400)
            .send({
                error: true,
                message: 'Please give a bot ID'
            });
        }

    if (!isSnowflake(ID)) {
        return res
            .status(400)
            .send({
                error: true,
                message: '\'bot_id\' must be a snowflake'
            });
        }

    const bot = db.get(`${ID}`);

    if (!bot) {
        return res.status(400).send({
            error: true,
            message: 'bot not found'
        });
    }

    const data = {
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

Router.get('/bots', rateLimit(15000, 4), (req, res) => {
    const bots = db.get('bot.IDs');

    res.json(bots);
});

Router.get(
    '/callback',
    passport.authenticate('discord', { failureRedirect: '/404' }),
    (req, res) => {
        console.log(`Testing: ${req.query.state}`);
        //  addUser(req.user);
        if (Developers.includes(req.user.id)) {
            req.session.isAdmin = true;
        } else {
            req.session.isAdmin = false;
        }
        res.redirect('/me');
        // maybe future features.
    }
);

/* beta site */

Router.get('/stats', (req, res) => {
    try {
        const data = {
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
        };
        res.json({
            error: false,
            data
        });
    } catch (e) {
        res.json({
            error: true,
            message: e
        });
    }
});

Router.use('*', (req, res) => {
    res
        .status(404)
        .json({
            error: true,
            status: 404,
            message: 'Endpoint not found'
        });
});

Router.use('*', (err, req, res) => {
    res
        .status(404)
        .json({
            error: true,
            status: 404,
            message: 'Endpoint not found'
        });
});

module.exports = Router;

function rateLimit(windowMs, max, req, res, next) {
    return rateLimitt({
        windowMs,
        max,
        //	keyGenerator: req.header("x-forwarded-for") || req.connection.remoteAddress,
        handler(req, res) {
            return res
                .status(429)
                .json({
                    error: true,
                    code: 429,
                    message: 'DanBot Hosting Stats API - You are sending too many requests, please slow down'
                });
        }
    });
}
