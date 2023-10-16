const axios = require("axios");
exports.run = async (client, message, args) => {
    //Random password gen
    const CAPSNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var getPassword = () => {
        var password = "";
        while (password.length < 10) {
            password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
        }
        return password;
    };

    let password = await getPassword();
    axios({
        url: config.Pterodactyl.hosturl + "/api/application/users/" + userData.get(message.author.id).consoleID,
        method: "GET",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            Authorization: "Bearer " + config.Pterodactyl.apikey,
            "Content-Type": "application/json",
            Accept: "Application/vnd.pterodactyl.v1+json",
        },
    }).then((fetch) => {
        const data = {
            email: fetch.data.attributes.email,
            username: fetch.data.attributes.username,
            first_name: fetch.data.attributes.first_name,
            last_name: fetch.data.attributes.last_name,
            password: password,
        };
        axios({
            url: config.Pterodactyl.hosturl + "/api/application/users/" + userData.get(message.author.id).consoleID,
            method: "PATCH",
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                Authorization: "Bearer " + config.Pterodactyl.apikey,
                "Content-Type": "application/json",
                Accept: "Application/vnd.pterodactyl.v1+json",
            },
            data: data,
        })
            .then((user) => {
                message.reply(
                    "The console account that is linked with the discord account has now been reset. Please check dms for the password. \nA email will also be sent containing the new password"
                );
                client.users.cache
                    .get(message.author.id)
                    .send(`New password for DanBot Hosting: ||**${data.password}**||`);

                const emailmessage = {
                    from: config.Email.From,
                    to: messagecollected.content,
                    subject: "DanBot Hosting - Password reset via bot",
                    html:
                        "Hello, the console account password for email: " +
                        userData.get(message.author.id).email +
                        " was just reset. here is the new password" +
                        data.password,
                };
                transport.sendMail(emailmessage);
            })
            .catch((err) => {
                message.reply(err);
            });
    });
};
