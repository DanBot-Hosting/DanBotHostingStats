const config = require("../../../config.json");
const axios = require("axios");

const fetchUsers = async () => {

    const res = await axios({
        method: "get",
        url: `${config.pterodactyl.panelUrl}/api/application/users`,
        headers: {
            "Authorization": `Bearer ${config.pterodactyl.adminKey}`,
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    });

    return res.data.data.map(user => {
        return {
            id: user.attributes.id,
            uuid: user.attributes.uuid,
            username: user.attributes.username,
            email: user.attributes.email,
            firstName: user.attributes.first_name,
            lastName: user.attributes.last_name,
            createdAt: user.attributes.created_at,
            updatedAt: user.attributes.updated_at,
        } 
    })
}

module.exports = fetchUsers;