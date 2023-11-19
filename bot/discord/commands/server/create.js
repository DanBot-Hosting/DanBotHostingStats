const serverCreateSettings = require("../../../../createData");
exports.run = async (client, message, args) => {
    let helpEmbed = new Discord.MessageEmbed()
        .setColor("RED")
        .setDescription(
            `List of servers: (use DBH!server create <type> <name>)\n\n*Please note that some nodes might be having trouble connecting to the bot which may lead into this process giving out an error.*\n`
        )
        //.addField("__**Minecraft:**__", "Forge \nPaper \nBedrock \nPocketmineMP \nWaterfall \nSpigot", true)
        //.addField("__**Grand Theft Auto:**__", "alt:V \nmultitheftauto \nRage.MP \nSA-MP", true)
        .addField("__**Languages:**__", "NodeJS \nPython \nJava \naio\n Rust (use rustc to create)", true)
        .addField("__**Bots:**__", "redbot", true)
        //.addField("__**Source Engine:**__", "GMod \nCS:GO \nARK:SE", true)
        .addField("__**Voice Servers:**__", "TS3 \nMumble", true)
        //.addField("__**SteamCMD:**__", "Rust \nDaystodie \nArma \nAssettocorsa \nAvorion \nBarotrauma", true)
        .addField("__**Databases:**__", "MongoDB \nRedis \nPostgres", true)
        .addField("__**Web Hosting:**__", "Nginx", true)
        .addField("__**Custom Eggs:**__", "ShareX \nOpenX", true)
        .addField("__**Software:**__", "codeserver \ngitea \nhaste\n uptimekuma\n grafana", true)
        .setFooter("Example: DBH!server create NodeJS Testing Server");

    const serverName = message.content.split(" ").slice(3).join(" ") || "Untitled Server (settings -> server name)";
    let consoleID = userData.get(message.author.id);

    if (consoleID == null) {
        message.reply(
            "Oh no, Seems like you do not have an account linked to your discord ID.\n" +
                "If you have not made an account yet please check out `" +
                config.DiscordBot.Prefix +
                "user new` to create an account \nIf you already have an account link it using `" +
                config.DiscordBot.Prefix +
                "user link`"
        );
        return;
    }
    let data = serverCreateSettings.createParams(serverName, consoleID.consoleID);

    if (!args[1]) {
        await message.reply(helpEmbed);
        return;
    }

    if (args[1] == "list") {
        await message.reply(helpEmbed);
        return;
    }

    let types = {
        storage: data.storage,
        nginx: data.nginx,
        nodejs: data.nodejs,
        python: data.python,
        aio: data.aio,
        java: data.java,
        //paper: data.paper,
        //forge: data.forge,
        //"alt:v": data.altv,
        //multitheftauto: data.multitheftauto,
        //"sa-mp": data.samp,
        //bedrock: data.bedrock,
        //pocketminemp: data.pocketminemp,
        //gmod: data.gmod,
        //"cs:go": data.csgo,
        //"ark:se": data.arkse,
        ts3: data.ts3,
        mumble: data.mumble,
        //rust: data.rust,
        mongodb: data.mongodb,
        redis: data.redis,
        postgres: data.postgres,
        //daystodie: data.daystodie,
        //arma: data.arma,
        //assettocorsa: data.assettocorsa,
        //avorion: data.avorion,
        //barotrauma: data.barotrauma,
        //waterfall: data.waterfall,
        //spigot: data.spigot,
        sharex: data.sharex,
        codeserver: data.codeserver,
        gitea: data.gitea,
        haste: data.haste,
        uptimekuma: data.uptimekuma,
        rustc: data.rustc,
        redbot: data.redbot,
        grafana: data.grafana,
        openx: data.openx
    };

    if (!Object.keys(types).includes(args[1].toLowerCase())) {
        return message.reply(helpEmbed);
    }

    function createServerAndSendResponse(type, message) {
        serverCreateSettings
            .createServer(types[type])
            .then((response) => {
                let embed = new Discord.MessageEmbed()
                    .setColor(`GREEN`)
                    .addField(`__**Status:**__`, response.statusText)
                    .addField(`__**Created for user ID:**__`, consoleID.consoleID)
                    .addField(`__**Server name:**__`, serverName)
                    .addField(`__**Type:**__`, type);

                if (type === "aio" || type === "java") {
                    embed.addField(
                        `__**WARNING**__`,
                        `**DO NOT USE JAVA TO RUN GAMESERVERS. IF THERE IS A GAME YOU ARE WANTING TO HOST AND IT DOES NOT HAVE A SERVER PLEASE MAKE A TICKET**`
                    );
                }

                message.reply(embed);
            })
            .catch((error) => {
                if (error == "AxiosError: Request failed with status code 400") {
                    const embed = new Discord.MessageEmbed()
                        .setColor("RED")
                        .addField(
                            `__**Failed to create a new server**__`,
                            `The node is currently full, Please check <#898327108898684938> for updates. \nIf there is no updates please alert the Panel admin (<@137624084572798976>)`
                        );
                    message.reply(embed);
                } else if (error == "AxiosError: Request failed with status code 504") {
                    const embed = new Discord.MessageEmbed()
                        .setColor("RED")
                        .addField(
                            `__**Failed to create a new server**__`,
                            `The node is currently offline or having issues, You can check the status of the node in this channel: <#898041845878247487>`
                        );
                    message.reply(embed);
                } else if (error == "AxiosError: Request failed with status code 429") {
                    const embed = new Discord.MessageEmbed()
                        .setColor("RED")
                        .addField(
                            `__**Failed to create a new server**__`,
                            `Uh oh, This shouldn\'t happen, Try again in a minute or two.`
                        );
                    message.reply(embed);
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setColor("RED")
                        .addField(`__**Failed to create a new server**__`, error);
                    message.reply(embed);
                }
            });
    }

    const type = args[1].toLowerCase();
    createServerAndSendResponse(type, message);
};
