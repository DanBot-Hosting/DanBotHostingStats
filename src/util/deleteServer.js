const Config = require('../../config.json');

module.exports = function(Endpoint) {
    return {
        url: Config.Pterodactyl.hosturl + Endpoint,
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + Config.Pterodactyl.apikey,
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    };
};