const config = require("../../../config.json");
const axios = require("axios");

const deleteUser = async (userId) => {

    const res = await axios({
        method: "DELETE",
        url: `${config.pterodactyl.panelUrl}/api/application/users/${userId}`,
        headers: {
            "Authorization": `Bearer ${config.pterodactyl.adminKey}`,
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    });

    return res.data.attributes;
}

module.exports = deleteUser;