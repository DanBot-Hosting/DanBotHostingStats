/*
    ____              ____        __     __  __           __  _
   / __ \____ _____  / __ )____  / /_   / / / /___  _____/ /_(_)___  ____ _
  / / / / __ `/ __ \/ __  / __ \/ __/  / /_/ / __ \/ ___/ __/ / __ \/ __ `/
 / /_/ / /_/ / / / / /_/ / /_/ / /_   / __  / /_/ (__  ) /_/ / / / / /_/ /
/_____/\__,_/_/ /_/_____/\____/\__/  /_/ /_/\____/____/\__/_/_/ /_/\__, /
Free Hosting forever!                                            /____/
*/
const axios = require('axios');

global.gamingFREE = [14] // Gaming nodes
global.botswebdbFREE = [3, 5, 8, 10] // Bots, Websites and Databases nodes
global.storageFREE = [13] // Storage nodes

/*
Node 1   : 9
Node 2   : 3
Node 3   : 5
Node 4   : 8
Node 5   : 10
Node 6   : 11
Node 7   : 12
Node 8   : 14
Node 9   : 15
Node 10  : 16
Node 11  : 17
Node 12  : 18
Node 13  : 19
Node 14  : 20
Node 15  : 21
Node 16  : 22
Node 17  : 24
Node 18  : 25
*/

let data = (serverName, userID) => {
    let toReturn = {
        nginx: null,
        reddiscordbot: null,
        nodejs: null,
        python: null,
        aio: null,
        storage: null,
        java: null,
        paper: null,
        forge: null,
        altv: null,
        multitheftauto: null,
        ragemp: null,
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
        postgres: null,
        daystodie: null,
        arma: null,
        assettocorsa: null,
        avorion: null,
        barotrauma: null,
        waterfall: null,
        spigot: null,
        sharex: null,
        codeserver: null,
        gitea: null,
        haste: null
    };

    for (let [name, filled] of Object.entries(createList)) {
        toReturn[name] = filled(serverName, userID);
    }
    return toReturn;
};

let createServer = (data) => {
    return axios({
        url: config.Pterodactyl.hosturl + "/api/application/servers",
        method: 'POST',
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
            'Content-Type': 'application/json',
            'Accept': 'Application/vnd.pterodactyl.v1+json',
        },
        data: data,
    })
}

module.exports = {
    createParams: data,
    createServer: createServer
};
