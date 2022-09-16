const config = require("../../../config.json");
const userDetails = require('./details')
const axios = require("axios");

const updateUser = async (userId, data) => {
    try {
        const user = await userDetails(userId);
        const res = await axios({
            url: `${config.pterodactyl.panelUrl}/api/application/users/${userId}`,
            method: "PATCH",
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': `Bearer ${config.pterodactyl.adminKey}`,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            },
            data: {
                email: data.email ?? user.email,
                username: data.username ?? user.username,
                first_name: data.first_name ?? user.first_name,
                last_name: data.last_name ?? user.last_name,
                language: data.language ?? user.language,
                root_admin: data.root_admin ?? user.root_admin,
                password: data.password ?? '',
                external_id: data.external_id ?? user.external_id
            }
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

module.exports = updateUser;