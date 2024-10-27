const axios = require("axios");
const Config = require("./config.json");
const createList = require("./servers.js");

const nodeTypes = {
  gamingFREE: [14],
  botswebdbFREE: [38],
  storageFREE: [36],
  gamingPREM: [27],
  botswebdbPREM: [40],
  storagePREM: [36],
};

global.nodeTypes = nodeTypes;

let data = (serverName, userID, isPremium = false) => {
  let toReturn = {};
  for (let [name, filled] of Object.entries(createList)) {
    toReturn[name] = filled(serverName, userID, isPremium);
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
};
