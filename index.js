/*
    ____              ____        __     __  __           __  _
   / __ \____ _____  / __ )____  / /_   / / / /___  _____/ /_(_)___  ____ _
  / / / / __ `/ __ \/ __  / __ \/ __/  / /_/ / __ \/ ___/ __/ / __ \/ __ `/
 / /_/ / /_/ / / / / /_/ / /_/ / /_   / __  / /_/ (__  ) /_/ / / / / /_/ /
/_____/\__,_/_/ /_/_____/\____/\__/  /_/ /_/\____/____/\__/_/_/ /_/\__, /
Free Hosting forever!                                            /____/
*/

const Config = require("./config.json");

const fs = require("fs");

//Discord Bot
const db = require("quick.db");
const Discord = require("discord.js");

global.moment = require("moment");
global.userData = new db.table("userData"); //User data, Email, ConsoleID, Link time, Username, DiscordID
global.nodeStatus = new db.table("nodeStatus"); //Node status. Online or offline nodes
global.userPrem = new db.table("userPrem"); //Premium user data, Donated, Boosted, Total
global.nodeServers = new db.table("nodeServers"); //Server count for node limits to stop nodes becoming overloaded
global.codes = new db.table("redeemCodes"); //Premium server redeem codes...
global.nodePing = new db.table("nodePing"); //Node ping response time

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildModeration,
        Discord.GatewayIntentBits.GuildEmojisAndStickers,
        Discord.GatewayIntentBits.GuildIntegrations,
        Discord.GatewayIntentBits.GuildWebhooks,
        Discord.GatewayIntentBits.GuildInvites,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildMessageTyping,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.DirectMessageReactions,
        Discord.GatewayIntentBits.DirectMessageTyping,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildScheduledEvents,
        Discord.GatewayIntentBits.AutoModerationConfiguration,
        Discord.GatewayIntentBits.AutoModerationExecution
    ],
    partials: [
        Discord.Partials.Channel,
        Discord.Partials.Message,
        Discord.Partials.Reaction
    ]
});

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

const CAPSNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
global.getPassword = () => {
    var password = "";
    while (password.length < 16) {
        password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
    }
    return password;
};

client.login(Config.DiscordBot.Token);