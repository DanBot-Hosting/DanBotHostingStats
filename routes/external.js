const Router = require('express').Router();
const db = require('quick.db');
const isSnowflake = require(`${process.cwd()}/util/isSnowflake.js`);

Router.get('/', (req, res) => {
    res.send('LMAO. what are you doing here...');
});

Router.get('/fetch', (req, res) => {
    if (req.headers.password == config.externalPassword) {
        if (!req.body.user) {
            res.send('Missing data.');
        } else if (userData.get(req.body.user) == null) {
                const data = {
                    error: 'No account found for that user!'
                };
                res.json(data);
            } else {
                const data = {
                    username: userData.get(req.body.user).username,
                    email: userData.get(req.body.user).email,
                    discordID: userData.get(req.body.user).discordID,
                    consoleID: userData.get(req.body.user).consoleID,
                    linkTime: userData.get(req.body.user).linkTime,
                    linkDate: userData.get(req.body.user).linkDate
                };
                res.json(data);
            }
    } else {
        res.send('Invalid Password!');
        console.log(chalk.red(`[WARNING] ${req.headers['x-forwarded-for' || 'cf-connecting-ip']} tried to access https://danbot.host/external/fetch`));
    }
});

Router.get('/fetch-all', (req, res) => {
    if (req.headers.password == config.externalPassword) {
        if (!req.body.user) {
            res.send('Missing data.');
        } else {
            const data = {
                all: userData.all()
            };
            res.json(data);
        }
    } else {
        res.send('Invalid Password!');
        console.log(chalk.red(`[WARNING] ${req.headers['x-forwarded-for' || 'cf-connecting-ip']} tried to access https://danbot.host/external/fetch-all`));
    }
});

module.exports = Router;