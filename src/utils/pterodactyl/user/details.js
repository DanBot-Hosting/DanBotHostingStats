const config = require("../../../config.json");
const axios = require("axios");

const userDetails = async (userId) => {

    const res = await axios({
        method: "GET",
        url: `${config.pterodactyl.panelUrl}/api/application/users/${userId}`,
        headers: {
            "Authorization": `Bearer ${config.pterodactyl.adminKey}`,
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    });

    return res.data.attributes;
}

module.exports = userDetails;