const config = require("../../../config.json");
const axios = require("axios");

const resetPassword = async (userData, password) => {
    try {

        const res = await axios({
            method: "patch",
            url: `${config.pterodactyl.panelUrl}/api/application/users/${userData.id}`,
            headers: {
                "Authorization": `Bearer ${config.pterodactyl.adminKey}`,
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            data: {
                "email": userData.email,
                "username": userData.username,
                "first_name": userData.firstName,
                "last_name": userData.lastName,
                "language": "en",
                "password": password
            }
        });

        return res.data;

    } catch (err) {
        console.log(err)
    }
}

module.exports = resetPassword;