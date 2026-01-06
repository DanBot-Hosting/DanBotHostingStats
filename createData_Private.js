const axios = require("axios");
const Config = require('./config.json');
const fs = require("fs");
const path = require("path");

// Private Node Configuration:
const PRIVATE_NODE_LOCATION = [43];

global.privateNodeLocations = PRIVATE_NODE_LOCATION;

let ServerTypes = {};

const createParams = (ServerName, ServerType, UserID) => {
    return ServerTypes[ServerType].createServer(ServerName, UserID, PRIVATE_NODE_LOCATION);
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
        const files = (await fs.promises.readdir("./create-private/")).filter((f) => f.endsWith(".js"));

        for (const file of files) {
            const fullPath = path.resolve("./create-private/", file);
            delete require.cache[require.resolve(fullPath)];
            const module = require(fullPath);

            ServerTypes[file.replace(".js", "")] = module;
        }
    } catch (Error) {
        console.error("Error reading files:", Error);
    }
}

module.exports = {
    serverTypes: ServerTypes,       // Types of servers property.
    createParams: createParams,     // Create server parameters with server name and user ID.
    createServer: createServer,     // Create server function.
    initialStart: initialStart,     // Initial start function.
};
