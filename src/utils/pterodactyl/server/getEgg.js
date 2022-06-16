const config = require("../../../config.json");
const axios = require("axios");

const getEgg = async (nestId, eggId) => {
    try {
        const res = await axios({
            method: "get",
            url: `${config.pterodactyl.panelUrl}/api/application/nests/${nestId}/eggs/${eggId}?include=variables`,
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

module.exports = getEgg;