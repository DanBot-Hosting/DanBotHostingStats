const config = require("../../../config.json");
const axios = require("axios");
const UserSchema = require("../../Schemas/User");

const createUser = async (data) => {
    try {
        const res = await axios({
            url: `${config.pterodactyl.panelUrl}/api/application/users`,
            method: "POST",
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': `Bearer ${config.pterodactyl.adminKey}`,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            },
            data: data
        });
        return {
            error: false,
            data: res.data
        };
    } catch (e) {
        return {
            error: true,
            data: e?.response?.data?.message
        }
    }
}

module.exports = createUser;