/*
    ____              ____        __     __  __           __  _
   / __ \____ _____  / __ )____  / /_   / / / /___  _____/ /_(_)___  ____ _
  / / / / __ `/ __ \/ __  / __ \/ __/  / /_/ / __ \/ ___/ __/ / __ \/ __ `/
 / /_/ / /_/ / / / / /_/ / /_/ / /_   / __  / /_/ (__  ) /_/ / / / / /_/ /
/_____/\__,_/_/ /_/_____/\____/\__/  /_/ /_/\____/____/\__/_/_/ /_/\__, /
Free Hosting forever!                                            /____/
*/
const axios = require("axios");

global.gamingFREE = [14]; // Gaming nodes
global.botswebdbFREE = [32]; // Bots, Websites and Databases nodes
global.storageFREE = [13]; // Storage nodes

/*
PNode 1  : 30
PNode 2  : 32
PNode 3  : 34
*/

let data = (serverName, userID) => {
    let toReturn = {
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
        // minio: null,
    };

    for (let [name, filled] of Object.entries(createList)) {
        toReturn[name] = filled(serverName, userID);
    }
    return toReturn;
};

let createServer = (data) => {
    return axios({
        url: config.Pterodactyl.hosturl + "/api/application/servers",
        method: "POST",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            Authorization: "Bearer " + config.Pterodactyl.apikey,
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
