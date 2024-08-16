const Discord = require("discord.js");
const axios = require("axios");

const generatePassword = require("../../util/generatePassword.js");
const Config = require('../../../config.json');

/**
 * User password command. Resets the password for the linked console account.
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {
    // Generates a 16 digit random password.
    const password = await generatePassword();

    // Gets the user's data.
    const userAccount = userData.get(message.author.id);

    if (userAccount == null) {
        message.channel.send("Nie posiadasz podpiętego konta z Discordem.");
        return;
    }

    // This Axios requests gets the initial details of the user account.
    axios({
        url: Config.Pterodactyl.hosturl + "/api/application/users/" + userAccount.consoleID,
        method: "GET",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            Authorization: "Bearer " + Config.Pterodactyl.apikey,
            "Content-Type": "application/json",
            Accept: "Application/vnd.pterodactyl.v1+json",
        },
    }).then((Fetch) => {
        // This data object is used to update the user account with the new password.
        const data = {
            email: Fetch.data.attributes.email,
            username: Fetch.data.attributes.username,
            first_name: Fetch.data.attributes.first_name,
            last_name: Fetch.data.attributes.last_name,
            password: password,
        };

        // This Axios request updates the user account with the new password.
        axios({
            url: Config.Pterodactyl.hosturl + "/api/application/users/" + userAccount.consoleID,
            method: "PATCH",
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                Authorization: "Bearer " + Config.Pterodactyl.apikey,
                "Content-Type": "application/json",
                Accept: "Application/vnd.pterodactyl.v1+json",
            },
            data: data,
        })
            .then((Response) => {
                const Embed = new Discord.MessageEmbed();
                Embed.setColor("BLUE");
                Embed.setTitle("Hasło zostało zresetowane!");
                Embed.setDescription(
                    "Konto w panelu połączone z twoim Discordem, zostało zresetowane.\n" +
                    "Sprawdź wiadomości prywatne. Nowe hasło zostało tam wysłane.\n\n" +
                    "Dodatkowo, wysłano do Ciebie maila z potwierdzeniem zmiany hasła."
                );

                message.channel.send(Embed);

                // Sends the user a direct message containing their new password.
                client.users.cache
                    .get(message.author.id)
                    .send(`Oto nowe hasło do Twojego konta: ||**${data.password}**||`);

                // Formatting the email message.
                const EmailMessage = {
                    from: Config.Email.From,
                    to: data.email,
                    subject: "DinoHost - Resetowanie hasła",
                    html:
                        "Witaj " + data.first_name + ",\n\n" +
                        "Poprosiłeś o zmianę hasła poprzez bota Discord.\n\n" +
                        "Mail:" + data.email + "\n" +
                        "Nazwa użytkownika:" + data.username + "\n" +
                        "Hasło:" + data.password + "\n" +
                        "Pozostaw te informacje bezpieczne i ukryte\n\n" +

                        "Jeśli to nie Ty prosiłeś o zmianę hasła, koniecznie skontaktuj się z nami!."
                };

                transport.sendMail(EmailMessage);
            })
            .catch((err) => {
                message.reply(err.message);
            });
    });
};

exports.description = "Resetuje hasło w panelu klienta.";