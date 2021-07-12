// route for users to get bot information

const Router = require("express").Router();
const db = require("quick.db");
const isSnowflake = require(process.cwd() + "/util/isSnowflake.js");

Router.get("/:ID/", (req, res) => {
    /*
    let ID = req.params.ID;
    if (!ID) return res.status(400).send({ error: true, message: "Please give a bot ID" });

    if (!isSnowflake(ID)) {
      return res.status(400).send({ error: true, message: "'bot_id' must be a snowflake" });
    }

    let bot = db.get(`${ID}`);
    if(!bot)return res.render("error.ejs", { message: "Bot Not Found" });

    res.render("bot/index.ejs", { bot, user: req.isAuthenticated() ? req.user : null });
    */

    return res.render("error.ejs", {message: "page temporarily deleted."});


});

Router.get("/:ID/remove", checkAuth, (req, res) => {

    let ID = req.params.ID;
    if (!ID) return res.status(400).send({error: true, message: "Please give a bot ID"});

    if (!isSnowflake(ID)) {
        return res.status(400).send({error: true, message: "'bot_id' must be a snowflake"});
    }

    let bot = db.get(`${ID}`);
    if (!bot) return res.render("error.ejs", {message: "Bot Not Found"});

    let allowed = ["137624084572798976"];
    allowed.push(bot.owner);

    if (allowed.includes(req.user.id)) {

        let bots = db.get("bot.IDs");
        var filtered = bots.filter(function (el) {
            return el != `${ID}`;
        });

        let ownerbots = db.get(`${bot.owner}.bots`);
        let own = ownerbots.filter(function (be) {
            return be != `${ID}`
        });

        db.delete(`${ID}`); // remove bot from db
        db.set("bot.IDs", filtered); // remove bot from the array
        db.set(`${bot.owner}.bots`, own);

        res.redirect("/me?s=removed_" + ID + "_from_stats");

    } else {
        return res.render("error.ejs", {message: "You're not authorized to make changes to this bot."});
    }
});

module.exports = Router;

/* Authorization check, if not authorized return them to the login page.
*/
function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.session.backURL = req.url;

        res.redirect("/login?redirect=" + req.url);
    }
}
