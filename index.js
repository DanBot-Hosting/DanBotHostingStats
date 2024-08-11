/*
    ____              ____        __     __  __           __  _
   / __ \____ _____  / __ )____  / /_   / / / /___  _____/ /_(_)___  ____ _
  / / / / __ `/ __ \/ __  / __ \/ __/  / /_/ / __ \/ ___/ __/ / __ \/ __ `/
 / /_/ / /_/ / / / / /_/ / /_/ / /_   / __  / /_/ (__  ) /_/ / / / / /_/ /
/_____/\__,_/_/ /_/_____/\____/\__/  /_/ /_/\____/____/\__/_/_/ /_/\__, /
Free Hosting forever!                                            /____/
*/

global.config = require("./config.json");

global.fs = require("fs");
global.chalk = require("chalk");
const nodemailer = require("nodemailer");
global.axios = require("axios");
global.transport = nodemailer.createTransport({
    host: config.Email.Host,
    port: config.Email.Port,
    auth: {
        user: config.Email.User,
        pass: config.Email.Password,
    },
});

//Discord Bot
let db = require("quick.db");
global.Discord = require("discord.js");

global.moment = require("moment");
global.userData = new db.table("userData"); //User data, Email, ConsoleID, Link time, Username, DiscordID
global.domains = new db.table("linkedDomains"); //Linked domains for unproxy and proxy cmd
global.nodeStatus = new db.table("nodeStatus"); //Node status. Online or offline nodes
global.userPrem = new db.table("userPrem"); //Premium user data, Donated, Boosted, Total
global.nodeServers = new db.table("nodeServers"); //Server count for node limits to stop nodes becoming overloaded
global.codes = new db.table("redeemCodes"); //Premium server redeem codes...
global.nodePing = new db.table("nodePing"); //Node ping response time

global.client = new Discord.Client({
    restTimeOffset: 0,
    disableMentions: "everyone",
    restWsBridgetimeout: 100,
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
global.bot = client;

//Event handler
fs.readdir("./src/events/", (err, files) => {
    files = files.filter((f) => f.endsWith(".js"));
    files.forEach((f) => {
        const event = require(`./src/events/${f}`);
        client.on(f.split(".")[0], event.bind(null, client));
        delete require.cache[require.resolve(`./src/events/${f}`)];
    });
});

global.createList = {};
global.createListPrem = {};

//Import all create server lists
fs.readdir("./create-free/", (err, files) => {
    files = files.filter((f) => f.endsWith(".js"));
    files.forEach((f) => {
        require(`./create-free/${f}`);
    });
});

fs.readdir("./create-premium/", (err, files) => {
    files = files.filter((f) => f.endsWith(".js"));
    files.forEach((f) => {
        delete require.cache[require.resolve(`./create-premium/${f}`)];
        require(`./create-premium/${f}`);
    });
});

//Global password gen
const CAPSNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
global.getPassword = () => {
    var password = "";
    while (password.length < 16) {
        password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
    }
    return password;
};

client.login(config.DiscordBot.Token);

process.on("unhandledRejection", (reason, p) => {
    console.error("[AntiCrash] :: Unhandled Rejection/Catch");
    console.error(reason, p);
});
process.on("uncaughtException", (err, origin) => {
    console.error("[AntiCrash] :: Uncaught Exception/Catch");
    console.error(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.error("[AntiCrash] :: Uncaught Exception/Catch (MONITOR)");
    console.error(err, origin);
});
process.on("multipleResolves", (type, promise, reason) => {
    console.error("[AntiCrash] :: Multiple Resolves");
    console.error(type, promise, reason);
});