const Discord = require('discord.js');

const Config = require('../../../config.json');
const MiscConfigs = require('../../../config/misc-configs.js');
const serverCreateSettings_Prem = require("../../../createData_Prem");

exports.description = "Creates a donator server. View this command for usage.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {

    //return message.channel.send("Server creation is disabled. Do not ping staff.");
    
    let userP = userPrem.fetch(message.author.id) || {
        used: 0,
        donated: 0,
    };

    //return message.channel.send("Server creation is disabled. Do not ping staff.");

    const serverName =
        message.content.split(" ").slice(3).join(" ") ||
        "Untitled Server (settings -> server name)";
    let consoleID = userData.get(message.author.id);

    if (consoleID == null) {
        message.reply(
            "Oh no, Seems like you do not have an account linked to your discord ID.\n" +
                "If you have not made an account yet please check out `" +
                Config.DiscordBot.Prefix +
                "user new` to create an account\nIf you already have an account link it using `" +
                Config.DiscordBot.Prefix +
                "user link`",
        );
        return;
    }

    let allowed = Math.floor(userP.donated / Config.PremiumServerPrice);

    let pServerCreatesettings = serverCreateSettings_Prem.createParams(
        serverName,
        consoleID.consoleID,
    );

    if (allowed === 0) {
        message.reply(
            "You're not a premium user, to get access to premium you can buy a server (2 servers/$1)",
        );
        return;
    }

    if (allowed - userP.used <= 0) {
        message.reply("You are at your premium server limit.");
        return;
    }

    const HelpEmbed = new Discord.EmbedBuilder();
    HelpEmbed.setColor("Red")
    HelpEmbed.addFields(
        {
            name: "Minecraft",
            value: "Forge\nPaper\nBedrock\nPocketmineMP\nWaterfall\nSpigot",
            inline: true,
        },
        {
            name: "Grand Theft Auto",
            value: "alt:V\nmultitheftauto\nRage.MP\nSA-MP",
            inline: true,
        },
        {
            name: "Languages",
            value: "NodeJS\nBun\nPython\nJava\naio\n Rust (use rustc to create)",
            inline: true,
        },
        {
            name: "Bots",
            value: "redbot",
            inline: true,
        },
        {
            name: "Source Engine",
            value: "GMod\nCS:GO\nARK:SE",
            inline: true,
        },
        {
            name: "Voice Servers",
            value: "TS3\nMumble",
            inline: true,
        },
        {
            name: "SteamCMD",
            value: "Rust\nDaystodie\nAssettocorsa\nAvorion\nBarotrauma",
            inline: true,
        },
        {
            name: "Databases",
            value: "MongoDB\nRedis\nPostgres14\nPostgres16\nMariaDB\nInfluxDB",
            inline: true,
        },
        {
            name: "WebHosting",
            value: "Nginx",
            inline: true,
        },
        {
            name: "Custom Eggs",
            value: "ShareX\nOpenX",
            inline: true,
        },
        {
            name: "Software",
            value: "codeserver\ngitea\nhaste\n uptimekuma\n grafana",
            inline: true,
        }
    )
    HelpEmbed.setFooter({ text: "Example: " + Config.DiscordBot.Prefix + "server create-donator aio My AIO Server", iconURL: client.user.displayAvatarURL() })
    HelpEmbed.setTimestamp();
    

    //Do server creation things
    if (!args[1]) {
        message.reply(
            {
                embeds: [
                    HelpEmbed
                ]
            }
        );
        return;
    }

    let types = {
        storage: pServerCreatesettings.storage,
        nginx: pServerCreatesettings.nginx,
        nodejs: pServerCreatesettings.nodejs,
        python: pServerCreatesettings.python,
        aio: pServerCreatesettings.aio,
        java: pServerCreatesettings.java,
        paper: pServerCreatesettings.paper,
        forge: pServerCreatesettings.forge,
        "alt:v": pServerCreatesettings.altv,
        multitheftauto: pServerCreatesettings.multitheftauto,
        "sa-mp": pServerCreatesettings.samp,
        bedrock: pServerCreatesettings.bedrock,
        pocketminemp: pServerCreatesettings.pocketminemp,
        gmod: pServerCreatesettings.gmod,
        "cs:go": pServerCreatesettings.csgo,
        "ark:se": pServerCreatesettings.arkse,
        ts3: pServerCreatesettings.ts3,
        mumble: pServerCreatesettings.mumble,
        rust: pServerCreatesettings.rust,
        mongodb: pServerCreatesettings.mongodb,
        redis: pServerCreatesettings.redis,
        postgres14: pServerCreatesettings.postgres14,
        postgres16: pServerCreatesettings.postgres16,
        daystodie: pServerCreatesettings.daystodie,
        assettocorsa: pServerCreatesettings.assettocorsa,
        avorion: pServerCreatesettings.avorion,
        barotrauma: pServerCreatesettings.barotrauma,
        waterfall: pServerCreatesettings.waterfall,
        spigot: pServerCreatesettings.spigot,
        sharex: pServerCreatesettings.sharex,
        codeserver: pServerCreatesettings.codeserver,
        gitea: pServerCreatesettings.gitea,
        haste: pServerCreatesettings.haste,
        uptimekuma: pServerCreatesettings.uptimekuma,
        rustc: pServerCreatesettings.rustc,
        redbot: pServerCreatesettings.redbot,
        grafana: pServerCreatesettings.grafana,
        openx: pServerCreatesettings.openx,
        mariadb: pServerCreatesettings.mariadb,
        lavalink: pServerCreatesettings.lavalink,
        rabbitmq: pServerCreatesettings.rabbitmq,
        palworld: pServerCreatesettings.palworld,
        nukkit: pServerCreatesettings.nukkit,
        curseforge: pServerCreatesettings.curseforge,
        scpsl: pServerCreatesettings.scpsl,
        bun: pServerCreatesettings.bun,
        influxdb: pServerCreatesettings.influxdb,
    };

    if (Object.keys(types).includes(args[1].toLowerCase())) {
        serverCreateSettings_Prem
            .createServer(types[args[1].toLowerCase()])
            .then((response) => {
                userPrem.set(message.author.id + ".used", userP.used + 1);

                let embed = new Discord.EmbedBuilder()
                    .setColor(`Green`)
                    .addFields(
                        {
                            name: `Status`,
                            value: response.statusText.toString(),
                            inline: false
                        },
                        {
                            name: `Created for user ID`,
                            value: consoleID.consoleID.toString(),
                            inline: false
                        },
                        {
                            name: `Server name`,
                            value: serverName.toString(),
                            inline: false
                        },
                        {
                            name: `Type`,
                            value: args[1].toLowerCase(),
                            inline: false
                        },
                        {
                            name: `__**WARNING**__`,
                            value: `Please do not host game servers on java or AIO servers. If you need a gameserver, You need to use Dono2. Slots are 1$ for 2 servers!`,
                            inline: false
                        }
                    )
                message.reply({embeds: [embed]});

                const embed2 = new Discord.EmbedBuilder()
                    .setTitle("New donator node server created!")
                    .setColor("Green")
                    .addFields(
                        {
                            name: "User:",
                            value: message.author.id.toString(),
                            inline: false
                        },
                        {
                            name: `Status`,
                            value: response.statusText.toString(),
                            inline: false
                        },
                        {
                            name: `Created for user ID`,
                            value: consoleID.consoleID.toString(),
                            inline: false
                        },
                        {
                            name: `Server name`,
                            value: serverName.toString(),
                            inline: false
                        },
                        {
                            name: `Type`,
                            value: args[1].toLowerCase().toString(),
                            inline: false
                        }
                    )
                    .setTimestamp()
                    .setFooter(
                        {
                            text: "User has " + (userP.used + 1) + " out of a max " + allowed + " servers",
                            iconURL: client.user.displayAvatarURL()
                        }
                    );

                client.channels.cache.get(MiscConfigs.donatorlogs).send({embeds: [embed2]});
            })
            .catch(async (error) => {
                const embed = new Discord.EmbedBuilder()
                .setColor("Red")

                if (error == "AxiosError: Request failed with status code 400") {
                    embed.addFields(
                            {
                                name: `__**Failed to create a new server**__`,
                                value: `The Donator node(s) are currently full, Please check <#` + MiscConfigs.serverStatus + `> for updates.\nIf there is no updates please alert a System Administrator (<@& ` + Config.DiscordBot.Roles.SystemAdmin + `>)`,
                            }
                        );
                } else if (error == "AxiosError: Request failed with status code 504") {

                    embed.addFields(
                        {
                            name: `__**Failed to create a new server**__`,
                            value: `The Donator node(s) are currently offline or having issues, You can check the status of the node in this channel: <#` + MiscConfigs.serverStatus + `>`,
                        }
                    )
                } else if (error == "AxiosError: Request failed with status code 429") {

                    embed.addFields(
                            {
                                name: `__**Failed to create a new server**__`,
                                value: `You are being rate limited, Please wait a few minutes and try again.`,
                            }
                        )
                } else {

                    embed.addFields(
                            {
                                name: `__**Failed to create a new server**__`,
                                value: `Some other issue happened. If this continues please open a ticket and report this to a bot admin. Please share this info with them: \nError: ${error}`,
                            }
                        )
                }

                await message.reply({embeds: [embed]});
            });
        return;
    } else {
        await message.reply(
            {
                embeds: [
                    HelpEmbed
                ]
            }
        );
    }
};
