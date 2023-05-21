/*
    ____              ____        __     __  __           __  _
   / __ \____ _____  / __ )____  / /_   / / / /___  _____/ /_(_)___  ____ _
  / / / / __ `/ __ \/ __  / __ \/ __/  / /_/ / __ \/ ___/ __/ / __ \/ __ `/
 / /_/ / /_/ / / / / /_/ / /_/ / /_   / __  / /_/ (__  ) /_/ / / / / /_/ /
/_____/\__,_/_/ /_/_____/\____/\__/  /_/ /_/\____/____/\__/_/_/ /_/\__, /
Free Hosting forever!                                            /____/
*/

global.config = require("./config.json");
global.enabled = require("./enable.json")

//New global cache system (Lazy way)
global.users = []
global.servers = []

//New functions to clean some code up - Not completed
require('./functions')

//Going to be used for the bot's invite api
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const PORT = config.Port;

global.fs = require("fs");
global.chalk = require('chalk');
const nodemailer = require('nodemailer');
global.axios = require('axios');
global.pretty = require('prettysize');
global.transport = nodemailer.createTransport({
    host: config.Email.Host,
    port: config.Email.Port,
    auth: {
        user: config.Email.User,
        pass: config.Email.Password
    }
});

// Initialising Node Checker
require('./nodestatsChecker');

//Discord Bot
global.puppeteer = require("puppeteer");
let db = require("quick.db");
global.Discord = require("discord.js");
global.tcpp = require('tcp-ping');

global.messageSnipes = new Discord.Collection();
global.fs = require("fs");
global.moment = require("moment");
global.userData = new db.table("userData"); //User data, Email, ConsoleID, Link time, Username, DiscordID
global.settings = new db.table("settings"); //Admin settings
global.webSettings = new db.table("webSettings"); //Web settings (forgot what this is even for)
global.mutesData = new db.table("muteData"); //Mutes, Stores current muted people and unmute times
global.domains = new db.table("linkedDomains"); //Linked domains for unproxy and proxy cmd
global.nodeStatus = new db.table("nodeStatus"); //Node status. Online or offline nodes
global.userPrem = new db.table("userPrem"); //Premium user data, Donated, Boosted, Total
global.nodeServers = new db.table("nodeServers"); //Server count for node limits to stop nodes becoming overloaded
global.codes = new db.table("redeemCodes"); //Premium server redeem codes...
global.sudo = new db.table("sudoCommands"); //Keep track of staff sudo
global.lastBotClaim = new db.table("lastBotClaim"); //Keep track of staff sudo
global.nodePing = new db.table("nodePing"); //Node ping response time
// Array.from(sudo.all()).forEach(sudo.delete); //On boot remove all sudos

global.client = new Discord.Client({
    restTimeOffset: 0,
    disableMentions: 'everyone',
    restWsBridgetimeout: 100,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
global.bot = client;
global.suggestionLog = new Discord.WebhookClient(config.DiscordSuggestions.channelID, config.DiscordSuggestions.channelID)
require('./bot/discord/commands/mute').init(client)

//Event handler
fs.readdir('./bot/discord/events/', (err, files) => {
    files = files.filter(f => f.endsWith('.js'));
    files.forEach(f => {
        const event = require(`./bot/discord/events/${f}`);
        client.on(f.split('.')[0], event.bind(null, client));
        delete require.cache[require.resolve(`./bot/discord/events/${f}`)];
    });
});
global.createList = {}
global.createListPrem = {};

//Import all create server lists
fs.readdir('./create-free/', (err, files) => {
    files = files.filter(f => f.endsWith('.js'));
    files.forEach(f => {
        require(`./create-free/${f}`);
    });
});

fs.readdir('./create-premium/', (err, files) => {
    files = files.filter(f => f.endsWith('.js'));
    files.forEach(f => {
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

//Bot login
client.login(config.DiscordBot.Token);
global.Allowed = ["137624084572798976"];

//Fetch node data
const { nodes } = require("./bot/discord/serverUsage.js");

/*
global.nodeData = new db.table("nodeData")
    setInterval(async() => {
        let res = await axios({
            url: "https://status.danbot.host/json/stats.json",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
        })
        nodes.Nodes.forEach(node => {
            res.data.servers.forEach(server => {
                if(server.name === nodes.name) {
                    if(server.online4 === false) return;
                    nodeData.set(response.data.info.servername, {
                        servername: server.name,
                        cpu: server.cpu,
                        cpuload: server.load,
                        memused: server.memory_used,
                        memtotal: server.memory_total,
                        swapused: server.swap_used,
                        swaptotal: server.swap_total,
                        diskused: server.hdd_used,
                        disktotal: server.hdd_total,
                        netrx: server.network_rx,
                        nettx: server.network_tx,
                        timestamp: res.updated
                    })
                }
            })
        })
    }, 2000);
*/
