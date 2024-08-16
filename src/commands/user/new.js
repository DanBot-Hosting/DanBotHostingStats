const Discord = require('discord.js');
const axios = require("axios");
const validator = require("validator");

const Config = require('../../../config.json');
const MiscConfigs = require('../../../config/misc-configs.js');

const generatePassword = require('../../util/generatePassword.js');

exports.description = "Tworzy nowe konto w panelu.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {

    if (userData.get(message.author.id) != null) {
        message.reply("Posiadasz już `konto w panelu` podpięte do Discorda.");
        return;
    }

    let questions = [
        {
            id: "tos",
            question:
                "https://dinohost.pl/rules\nCzy akceptujesz nasz regulamin? (**TAK/NIE**)", // The questions...
            filter: (m) => m.author.id === message.author.id, // Filter to use...
            afterChecks: [
                {
                    check: (msg) => msg.toLowerCase() == "tak",
                    errorMessage: "Musisz zaakceptować nasz regulamin!",
                },
            ],
            time: 1000 * 60 * 10, // how much time a user has to answer the question before it times out
            value: null, // The user's response.
        },
        {
            id: "username",
            question:
                "Nazwa użytkownika (**nie używaj spacji oraz specjalnych znaków**)", // The questions...
            filter: (m) => m.author.id === message.author.id, // Filter to use...
            afterChecks: [
                {
                    check: (msg) => msg.trim().split(" ").length == 1,
                    errorMessage: "Nazwa nie może posiadać żadnych spacji.",
                },
            ],
            time: 30000, // how much time a user has to answer the question before it times out
            value: null, // The user's response.
        },
        {
            id: "email",
            question: "Adres email *(musi być poprawny)*",
            filter: (m) => m.author.id === message.author.id,
            afterChecks: [
                {
                    check: (msg) => validator.isEmail(msg.toLowerCase().trim()),
                    errorMessage: "Adres email musi być poprawny.",
                },
            ],
            time: 30000,
            value: null,
        },
    ];

    // Locate the account creation category
    let category = message.guild.channels.cache.find(
        (c) => c.id === MiscConfigs.accounts && c.type === "category",
    );

    // if not found throw an error
    if (!category) throw new Error("Kategoria nie istnieje.");

    // Create the channel in which the user will use to create his account
    let channel = await message.guild.channels
        .create(message.author.tag, {
            parent: category.id,
            permissionOverwrites: [
                {
                    id: message.author.id,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
                },
                {
                    id: message.guild.id,
                    deny: 0x400,
                },
            ],
        })
        .catch(console.error);

    channel.updateOverwrite(message.author, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
        READ_MESSAGE_HISTORY: true,
    });

    // Tell the user to check the channel.
    message.reply(`Sprawdź <#${channel.id}>, aby dokończyć rejstrację konta.`);

    // Send the initial question.

    let msg = null;

    for (const question of questions) {
        if (msg == null) {
            msg = await channel.send(message.member, {
                embed: new Discord.MessageEmbed()
                    .setColor(0x36393e)
                    .setDescription(question.question)
                    .setFooter("Napisz 'cancel', aby anulować."),
            });
        } else {
            msg.edit(message.member, {
                embed: msg.embeds[0].setDescription(question.question),
            });
        }

        let awaitMessages = await channel
            .awaitMessages(question.filter, {
                max: 1,
                time: question.time,
                errors: ["time"],
            })
            .catch((x) => {
                channel.send("Użytkownik nie podał danych!\nRejstracja przerwana!");
                setTimeout(() => {
                    channel.delete();
                }, 5000);
                return;
            });
        // Log the value...
        question.value = awaitMessages.first().content.trim();

        await awaitMessages.first().delete();

        if (question.value == "cancel") {
            msg.delete();
            channel.send("Przerwano rejstrację konta!");

            setTimeout(() => {
                channel.delete();
            }, 5000);
            return;
        }

        for (const aftercheck of question.afterChecks) {
            if (aftercheck.check(question.value) == false) {
                channel.send(aftercheck.errorMessage);
                channel.send("Przerwano rejstrację konta!");
                setTimeout(() => {
                    channel.delete();
                }, 5000);
                return;
            }
        }
    }

    msg.edit(message.member, {
        embed: msg.embeds[0]
            .setDescription(
                "Tworzę konto dla Ciebie...\n\n>>> " +
                questions
                    .map((question) => `**${question.id}:** ${question.value.toLowerCase()}`)
                    .join("\n"),
            )
            .setFooter("")
            .setTimestamp(),
    });

    const data = {
        username: questions.find((question) => question.id == "username").value.toLowerCase(),
        email: questions.find((question) => question.id == "email").value.toLowerCase(),
        first_name: questions.find((question) => question.id == "username").value,
        last_name: ".",
        password: generatePassword(),
        root_admin: false,
        language: "en",
    };

    axios({
        url: Config.Pterodactyl.hosturl + "/api/application/users",
        method: "POST",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            Authorization: "Bearer " + Config.Pterodactyl.apikey,
            "Content-Type": "application/json",
            Accept: "Application/vnd.pterodactyl.v1+json",
        },
        data: data,
    })
        .then((user) => {
            userData.set(`${message.author.id}`, {
                discordID: message.author.id,
                consoleID: user.data.attributes.id,
                email: user.data.attributes.email,
                username: user.data.attributes.username,
                linkTime: moment().format("HH:mm:ss"),
                linkDate: moment().format("YYYY-MM-DD"),
                domains: [],
            });

            msg.edit("Cześć! Utworzyłeś nowe konto w panelu , oto dane logowania:", {
                embed: new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(
                        "URL: " +
                        Config.Pterodactyl.hosturl +
                        " \nNazwa: " +
                        data.username +
                        " \nEmail: " +
                        data.email +
                        " \nHasło: " +
                        data.password,
                    )
                    .setFooter("Uwaga! Zaleca się jak najszybszą zmianę hasła."),
            });

            channel.send(
                "**Masz 30 minut na zapisanie tej informacji, zanim kanał zostanie usunięty.**",
            );
            message.guild.members.cache.get(message.author.id).roles.add(Config.DiscordBot.Roles.Client);

            setTimeout(function () {
                channel.delete();
            }, 1800000);
        })
        .catch((err) => {
            let errors = err.response.data.errors;

            if (errors) {
                msg.edit("", {
                    embed: new Discord.MessageEmbed()
                        .setColor("RED")
                        .setTitle("Wystąpił błąd:")
                        .setDescription(
                            "**BŁĘDY:**\n\n- " +
                            errors.map((error) => error.detail.replace("\n", " ")).join("\n- "),
                        )
                        .setTimestamp()
                        .setFooter("Usuwam kanał w ciągu 30 sekund..."),
                });
                setTimeout(function () {
                    channel.delete();
                }, 30000);
            } else {
                channel.send("Wystąpił nieoczekiwany błąd, spróbuj ponownie później...");
                setTimeout(function () {
                    channel.delete();
                }, 30000);
            }
        });
};