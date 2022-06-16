const config = require("../../../config.json");
const axios = require("axios");

const deleteServer = async (serverId) => {
    try {

        const res = await axios({
            method: "DELETE",
            url: `${config.pterodactyl.panelUrl}/api/application/servers/${serverId}/force`,
            headers: {
                "Authorization": `Bearer ${config.pterodactyl.aplicationKey}`,
                "Accept": "Application/vnd.pterodactyl.v1+json",
                "Content-Type": "application/json",
            }
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

module.exports = deleteServer;