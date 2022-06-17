const config = require("../../../config.json");
const axios = require("axios");

const getAllocations = async (nodeId) => {
    try {
        const res = await axios({
            method: "get",
            url: `${config.pterodactyl.panelUrl}/api/application/nodes/${nodeId}/allocations?per_page=2000`,
            headers: {
                "Authorization": `Bearer ${config.pterodactyl.aplicationKey}`,
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        });

        return res.data;
    } catch (err) {
        console.log(err?.response.data.errors)
    }
}

module.exports = getAllocations;