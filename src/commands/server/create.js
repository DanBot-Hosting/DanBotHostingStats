const Discord = require('discord.js');

const Config = require('../../../config.json');
const MiscConfigs = require('../../../config/misc-configs.js');
const serverCreateSettings = require("../../../createData");

exports.description = "Create a free server. View this command for usage.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {

    return message.channel.send("Server creation is disabled. Do not ping staff.");

    const helpEmbed = new Discord.EmbedBuilder()
        .setColor("Red")
        .setDescription(
            `List of servers: (use ` + Config.DiscordBot.Prefix + `server create <type> <name>)\n\n*Please note that some nodes might be having trouble connecting to the bot which may lead into this process giving out an error.*\n`,
        )
        .addFields(
            {
                name: "__**Languages:**__",
                value: "NodeJS \nBun \nPython \nJava \naio\n Rust (use rustc to create)",
                inline: true
            },
            {
                name: "__**Bots:**__",
                value: "redbot",
                inline: true
            },
            {
                name: "__**Voice Servers:**__",
                value: "TS3 \nMumble",
                inline: true
            },
            {
                name: "__**Databases:**__",
                value: "MongoDB \nRedis \nPostgres14 \nPostgres16 \nMariaDB",
                inline: true
            },
            {
                name: "__**Web Hosting:**__",
                value: "Nginx",
                inline: true
            },
            {
                name: "__**Custom Eggs:**__",
                value: "ShareX \nOpenX",
                inline: true
            },
            {
                name: "__**Software:**__",
                value: "codeserver \ngitea \nhaste\n uptimekuma\n grafana \n rabbitmq",
                inline: true
            },
            {
                name: "__**Storage:**__",
                value: "storage",
                inline: true
            }
        )
        .setFooter({text: "Example: " + Config.DiscordBot.Prefix + "server create NodeJS Testing Server", iconURL: client.user.avatarURL()});

    const serverName =
        message.content.split(" ").slice(3).join(" ") ||
        "Untitled Server (settings -> server name)";
    let consoleID = userData.get(message.author.id);

    if (consoleID == null) {
        message.reply(
            "Oh no, Seems like you do not have an account linked to your discord ID.\n" +
                "If you have not made an account yet please check out `" +
                Config.DiscordBot.Prefix +
                "user new` to create an account \nIf you already have an account link it using `" +
                Config.DiscordBot.Prefix +
                "user link`",
        );
        return;
    }
    let data = serverCreateSettings.createParams(serverName, consoleID.consoleID);

    if (!args[1]) {
        await message.reply({embeds: [helpEmbed]});
        return;
    }

    if (args[1] == "list") {
        await message.reply({embeds: [helpEmbed]});
        return;
    }

    let types = {
        storage: data.storage,
        nginx: data.nginx,
        nodejs: data.nodejs,
        python: data.python,
        aio: data.aio,
        java: data.java,
        ts3: data.ts3,
        mumble: data.mumble,
        mongodb: data.mongodb,
        redis: data.redis,
        postgres14: data.postgres14,
        postgres16: data.postgres16,
        sharex: data.sharex,
        codeserver: data.codeserver,
        gitea: data.gitea,
        haste: data.haste,
        uptimekuma: data.uptimekuma,
        rustc: data.rustc,
        redbot: data.redbot,
        grafana: data.grafana,
        openx: data.openx,
        mariadb: data.mariadb,
        rabbitmq: data.rabbitmq,
        bun: data.bun,
        storage: data.storage,
    };

    if (!Object.keys(types).includes(args[1].toLowerCase())) {
        return message.reply({embeds: [helpEmbed]});
    }

    function createServerAndSendResponse(type, message) {
        serverCreateSettings
            .createServer(types[type])
            .then((response) => {
                const embed = new Discord.EmbedBuilder()
                    .setColor(`Green`)
                    .addFields(
                        {
                            name: "__**Status:**__",
                            value: response.statusText.toString(),
                            inline: false,
                        },
                        {
                            name: "__**Created for user ID:**__",
                            value: consoleID.consoleID.toString(),
                            inline: false,
                        },
                        {
                            name: "__**Server name:**__",
                            value: serverName.toString(),
                            inline: false,
                        },
                        {
                            name: "__**Type:**__",
                            value: type.toString(),
                            inline: false,
                        }
                    )

                if (type === "aio" || type === "java") {
                    embed.addFields(
                        {
                            name: "__**WARNING**__",
                            value: `Please do not host game servers on java or AIO servers. If you need a Game Server, use a Game Node. Slots are 1$ for` + (1 / Config.PremiumServerPrice) + ` servers!`,
                        }
                    );
                }

                message.reply({embeds: [embed]});
            })
            .catch(async (error) => {
                const ErrorEmbed = new Discord.EmbedBuilder()
                    .setColor("Red")
                    .setTimestamp()
                    .setFooter({'text': "Command Executed By: " + message.author.username + ` (${message.author.id})`, "iconURL": message.author.avatarURL()})


                if (error == "AxiosError: Request failed with status code 400") {

                        ErrorEmbed.setTitle("Error: Failed to Create a New Server")
                        ErrorEmbed.setDescription("The Node is currently full, Please check " + MiscConfigs.serverStatus + " for updates. \nIf there is no updates please alert a System Administrator (<@&" + Config.DiscordBot.Roles.SystemAdmin + ">)")

                } else if (error == "AxiosError: Request failed with status code 504") {

                        ErrorEmbed.setTitle("Error: Failed to Create a New Server")
                        ErrorEmbed.setDescription("The Node is currently offline or having issues, You can check the status of the node in this channel: <#" + MiscConfigs.serverStatus + ">")

                } else if (error == "AxiosError: Request failed with status code 429") {

                        ErrorEmbed.setTitle("Error: Failed to Create a New Server");
                        ErrorEmbed.setDescription("You are being rate limited, Please wait a few minutes and try again.");
            
                } else {

                        ErrorEmbed.setTitle("Error: Failed to Create a New Server");
                        ErrorEmbed.setDescription(`Some other issue happened. If this continues please open a ticket and report this to a <@&${Config.DiscordBot.Roles.BotAdmin}> Please share this info with them: \n\n` + "```Error: " + error + "```");
                }

                await message.reply({embeds: [ErrorEmbed]});
            });
    }

    const type = args[1].toLowerCase();
    createServerAndSendResponse(type, message);
};
