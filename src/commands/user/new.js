const Discord = require('discord.js');
const axios = require("axios");
const validator = require("validator");

const Config = require('../../../config.json');
const MiscConfigs = require('../../../config/misc-configs.js');

const generatePassword = require('../../util/generatePassword.js');

exports.description = "Create a new panel account.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {

    if (userData.get(message.author.id) != null) {
        message.reply("You already have a `panel account` linked to your discord account");
        return;
    }

    let questions = [
        {
            id: "tos",
            question:
                "https://docs.google.com/document/d/1BxGFRlH3TEMqfUWBPszsWYudbKmcbM5pkp7bTq4IbHg\nPlease read our TOS, do you accept? (**yes or no**)", // The questions...
            filter: (m) => m.author.id === message.author.id, // Filter to use...
            afterChecks: [
                {
                    check: (msg) => msg.toLowerCase() == "yes",
                    errorMessage: "You must accept our TOS!",
                },
            ],
            time: 1000 * 60 * 10, // how much time a user has to answer the question before it times out
            value: null, // The user's response.
        },
        {
            id: "username",
            question:
                "What should your username be? (**Please don't use spaces or special characters**)", // The questions...
            filter: (m) => m.author.id === message.author.id, // Filter to use...
            afterChecks: [
                {
                    check: (msg) => msg.trim().split(" ").length == 1,
                    errorMessage: "username must not contain any spaces",
                },
            ],
            time: 30000, // how much time a user has to answer the question before it times out
            value: null, // The user's response.
        },
        {
            id: "email",
            question: "What's your email? *(must be a valid email)*",
            filter: (m) => m.author.id === message.author.id,
            afterChecks: [
                {
                    check: (msg) => validator.isEmail(msg.toLowerCase().trim()),
                    errorMessage: "The email must be valid.",
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
    if (!category) throw new Error("Category channel does not exist");

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
    message.reply(`Please check <#${channel.id}> to create an account.`);

    //Send the initial question.

    let msg = null;

    for (const question of questions) {
        if (msg == null) {
            msg = await channel.send(message.member, {
                embed: new Discord.MessageEmbed()
                    .setColor(0x36393e)
                    .setDescription(question.question)
                    .setFooter("You can type 'cancel' to cancel the request"),
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
                channel.send("User failed to provide an input!\nAccount creation cancelled!");
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
            channel.send("Cancelled!");

            setTimeout(() => {
                channel.delete();
            }, 5000);
            return;
        }

        for (const aftercheck of question.afterChecks) {
            if (aftercheck.check(question.value) == false) {
                channel.send(aftercheck.errorMessage);
                channel.send("Account creation cancelled!");
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
                "Attempting to create an account for you...\n\n>>> " +
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
        url: config.Pterodactyl.hosturl + "/api/application/users",
        method: "POST",
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
            userData.set(`${message.author.id}`, {
                discordID: message.author.id,
                consoleID: user.data.attributes.id,
                email: user.data.attributes.email,
                username: user.data.attributes.username,
                linkTime: moment().format("HH:mm:ss"),
                linkDate: moment().format("YYYY-MM-DD"),
                domains: [],
            });

            msg.edit("Hello! You created an new account, Here's the login information", {
                embed: new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(
                        "URL: " +
                            config.Pterodactyl.hosturl +
                            " \nUsername: " +
                            data.username +
                            " \nEmail: " +
                            data.email +
                            " \nPassword: " +
                            data.password,
                    )
                    .setFooter("Please note: It is recommended that you change the password"),
            });

            channel.send(
                "**You have 30 minutes to keep note of this info before the channel is deleted.**",
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
                        .setTitle("An error has occured:")
                        .setDescription(
                            "**ERRORS:**\n\n- " +
                                errors.map((error) => error.detail.replace("\n", " ")).join("\n- "),
                        )
                        .setTimestamp()
                        .setFooter("Deleting in 30 seconds..."),
                });
                setTimeout(function () {
                    channel.delete();
                }, 30000);
            } else {
                channel.send("An unexpected error has occured, please try again later...");
                setTimeout(function () {
                    channel.delete();
                }, 30000);
            }
        });
};