const axios = require("axios");
const Config = require('./config.json');
const fs = require("fs");

global.gamingPREM = [27]; // Donator Gaming Node Locations.
global.botswebdbPREM = [40]; // Donator Bot, Website, Databases Node Locations.
global.storagePREM = [36]; // Donator Storage Node Locations.

global.createList = {};
global.createListPrem = {};

/*
Donator Nodes as followed:
Dono-01  : 26
Dono-02  : 27
Dono-03  : 28
*/

const serverTypes = {
    nginx: null,
    nodejs: null,
    python: null,
    aio: null,
    storage: null,
    java: null,
    paper: null,
    forge: null,
    altv: null,
    multitheftauto: null,
    samp: null,
    bedrock: null,
    pocketminemp: null,
    gmod: null,
    csgo: null,
    arkse: null,
    ts3: null,
    mumble: null,
    rust: null,
    mongodb: null,
    redis: null,
    postgres14: null,
    postgres16: null,
    daystodie: null,
    assettocorsa: null,
    avorion: null,
    barotrauma: null,
    waterfall: null,
    spigot: null,
    sharex: null,
    codeserver: null,
    gitea: null,
    haste: null,
    uptimekuma: null,
    rustc: null,
    redbot: null,
    grafana: null,
    openx: null,
    mariadb: null,
    lavalink: null,
    rabbitmq: null,
    palworld: null,
    nukkit: null,
    curseforge: null,
    bun: null,
    influxdb: null,
};

let data = (serverName, userID) => {
    let toReturn = {};
    for (let [name, filled] of Object.entries(createListPrem)) {
        toReturn[name] = filled(serverName, userID);
    }
    return toReturn;
};

let createServer = (data) => {
    return axios({
        url: Config.Pterodactyl.hosturl + "/api/application/servers",
        method: "POST",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            Authorization: "Bearer " + Config.Pterodactyl.apikey,
            "Content-Type": "application/json",
            Accept: "Application/vnd.pterodactyl.v1+json",
        },
        data: data,
    });
};

function initialStart() {
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
}

module.exports = {
    createParams: data,
    createServer: createServer,
    serverTypes: serverTypes,
    initialStart: initialStart
};