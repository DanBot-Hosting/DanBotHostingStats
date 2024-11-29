const axios = require("axios");
const Config = require('./config.json');
const fs = require("fs");
const path = require("path");

global.gamingPREM = [27]; // Donator Gaming Node Locations.
global.botswebdbPREM = [40]; // Donator Bot, Website, Databases Node Locations.
global.storagePREM = [36]; // Donator Storage Node Locations.

let ServerTypes = {};

const createParams = (ServerName, ServerType, UserID) => {
    return ServerTypes[ServerType].createServer(ServerName, UserID);
};

const createServer = (ServerData) => {
    return axios({
        url: Config.Pterodactyl.hosturl + "/api/application/servers",
        method: "POST",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            Authorization: "Bearer " + Config.Pterodactyl.apikey,
            "Content-Type": "application/json",
            Accept: "Application/vnd.pterodactyl.v1+json"
        },
        data: ServerData,
    });
};

async function initialStart() {
    try {
        const files = (await fs.promises.readdir("./create-premium/")).filter((f) => f.endsWith(".js"));

        for (const file of files) {
            const fullPath = path.resolve("./create-premium/", file);
            delete require.cache[require.resolve(fullPath)];
            const module = require(fullPath);

            ServerTypes[file.replace(".js", "")] = module;
        }
    } catch (Error) {
        console.error("Error reading files:", Error);
    }
}

module.exports = {
    serverTypes: ServerTypes,   //Types of servers property.
    createParams: createParams, //Create server parameters with server name and user ID.
    createServer: createServer, //Create server function.
    initialStart: initialStart  //Initial start function.
};