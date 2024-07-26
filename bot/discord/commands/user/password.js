const Discord = require("discord.js");
const axios = require("axios");

const generatePassword = require('../../util/generatePassword.js');
const Configs = require('../../../../config.json')

/**
 * User password command. Resets the password for the linked console account.
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {

    //Generates a 16 digit random password.
    const password = await generatePassword();

    //Gets the user's data.
    const userAccount = userData.get(message.author.id);

    if (userAccount == null) {
        message.channel.send("You do not have a console account linked with your discord account.");
        return;
    };

    //This Axios requests gets the initial details of the user account.
    axios({
        url: Configs.Pterodactyl.hosturl + "/api/application/users/" + userAccount.consoleID,
        method: "GET",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            Authorization: "Bearer " + Configs.Pterodactyl.apikey,
            "Content-Type": "application/json",
            Accept: "Application/vnd.pterodactyl.v1+json",
        },
    }).then((Fetch) => {

        //This data object is used to update the user account with the new password.
        const data = {
            email: Fetch.data.attributes.email,
            username: Fetch.data.attributes.username,
            first_name: Fetch.data.attributes.first_name,
            last_name: Fetch.data.attributes.last_name,
            password: password,
        };

        //This Axios request updates the user account with the new password.
        axios({
            url: Configs.Pterodactyl.hosturl + "/api/application/users/" + userAccount.consoleID,
            method: "PATCH",
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                Authorization: "Bearer " + Configs.Pterodactyl.apikey,
                "Content-Type": "application/json",
                Accept: "Application/vnd.pterodactyl.v1+json",
            },
            data: data,

        }).then((Response) => {

                const Embed = new Discord.MessageEmbed();
                Embed.setColor("BLUE");
                Embed.setTitle("Password Reset Success");
                Embed.setDescription(
                    "The console account that is linked with the discord account has now been reset.\n" +
                    "Please check direct messages for the password. If you didn't recieve a message, you do not have direct messages enabled for this server.\n\n" +
                    "An email has also been sent to your email connected "
                );

                message.channel.send(Embed);

                //Sends the user a direct message containing their new password.
                client.users.cache.get(message.author.id).send(`New password for DanBot Hosting: ||**${data.password}**||`);

                //Formatting the email message.
                const EmailMessage = {
                    from: Configs.Email.From,
                    to: data.email,
                    subject: "DanBot Hosting - Password reset via bot",
                    html:
                        "Hello, the console account password for email: " +
                        data.email +
                        " was just reset. here is the new password" +
                        data.password,
                };

                transport.sendMail(EmailMessage);
            })
            .catch((err) => {
                message.reply(Error);
            });
    });
};

exports.description = "Resets the password for the linked console account.";