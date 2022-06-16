const config = require("../../../config.json");
const axios = require("axios");

const createServer = async (obj) => {
    try {

        const res = await axios({
            method: "POST",
            url: `${config.pterodactyl.panelUrl}/api/application/servers`,
            headers: {
                "Authorization": `Bearer ${config.pterodactyl.aplicationKey}`,
                "Accept": "Application/vnd.pterodactyl.v1+json",
                "Content-Type": "application/json",
            },
            data: obj,
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

module.exports = createServer;