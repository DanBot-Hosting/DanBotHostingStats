const Router = require("express").Router();
const db = require("quick.db");
const isSnowflake = require(process.cwd() + "/util/isSnowflake.js");

Router.get("/", (req, res) => {
    res.send('LMAO. what are you doing here...')
});

Router.get("/fetch", (req, res) => {
    var headers = JSON.stringify(req.headers)
    console.log(headers)
    if (headers.password == config.externalPassword) {
        res.send('Hello!')
    } else {
        res.send('No permission!')
    }
});

module.exports = Router;