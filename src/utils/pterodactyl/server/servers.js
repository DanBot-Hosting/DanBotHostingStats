const config = require("../../../config.json");
const axios = require("axios");

const servers = async (consoleId) => {
    try {

        const res = await axios({
            method: "GET",
            url: `${config.pterodactyl.panelUrl}/api/application/users/${consoleId}?include=servers`,
            headers: {
                "Authorization": `Bearer ${config.pterodactyl.aplicationKey}`,
                "Accept": "Application/vnd.pterodactyl.v1+json",
                "Content-Type": "application/json",
            },
        });

        return {
            error: false,
            data: res.data,
        }
    } catch (err) {

        return {
            error: true,
            data: err?.response.data.errors,
        }
    }
}

module.exports = servers;