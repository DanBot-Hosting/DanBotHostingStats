const axios = require("axios");
const Config = require('./config.json');

global.gamingFREE = [14]; // Gaming nodes
global.botswebdbFREE = [38]; // Bots, Websites and Databases nodes
global.storageFREE = [36]; // Storage nodes

const serverTypes = {
    nginx: null,
    nodejs: null,
    python: null,
    aio: null,
    java: null,
    ts3: null,
    mumble: null,
    mongodb: null,
    redis: null,
    postgres14: null,
    postgres16: null,
    sharex: null,
    codeserver: null,
    gitea: null,
    haste: null,
    uptimekuma: null,
    redbot: null,
    grafana: null,
    openx: null,
    mariadb: null,
    rabbitmq: null,
    bun: null,
    storage: null,
};

let data = (serverName, userID) => {
    let toReturn = {};
    for (let [name, filled] of Object.entries(createList)) {
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

module.exports = {
    createParams: data,
    createServer: createServer,
    serverTypes: serverTypes,
};