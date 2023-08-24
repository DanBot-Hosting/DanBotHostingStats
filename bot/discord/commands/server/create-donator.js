const serverCreateSettings_Prem = require("../../../../createData_Prem");
const axios = require("axios");

exports.run = async (client, message, args) => {
    let userP = userPrem.fetch(message.author.id) || {
        used: 0,
        donated: 0,
    };

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

    let allowed = Math.floor(userP.donated / config.node7.price);

    let pServerCreatesettings = serverCreateSettings_Prem.createParams(serverName, consoleID.consoleID);

    if (allowed === 0) {
        message.reply("You're not a premium user, to get access to premium you can buy a server (1server/$1)");
        return;
    }

    if (allowed - userP.used <= 0) {
        message.reply("You are at your premium server limit");
        return;
    }

    //Do server creation things
    if (!args[1]) {
        message.reply(
            new Discord.MessageEmbed()
                .setColor("RED")
                .addField("__**Minecraft:**__", "Forge \nPaper \nBedrock \nPocketmineMP \nWaterfall \nSpigot", true)
                .addField("__**Grand Theft Auto:**__", "alt:V \nmultitheftauto \nRage.MP \nSA-MP", true)
                .addField("__**Languages:**__", "NodeJS \nPython \nJava \naio\n Rust (use rustc to create)", true)
                .addField("__**Bots:**__", "redbot", true)
                .addField("__**Source Engine:**__", "GMod \nCS:GO \nARK:SE", true)
                .addField("__**Voice Servers:**__", "TS3 \nMumble", true)
                .addField("__**SteamCMD:**__", "Rust \nDaystodie \nArma \nAssettocorsa \nAvorion \nBarotrauma", true)
                .addField("__**Databases:**__", "MongoDB \nRedis \nPostgres", true)
                .addField("__**WebHosting:**__", "Nginx", true)
                .addField("__**Custom Eggs:**__", "ShareX", true)
                .addField("__**Software:**__", "codeserver \ngitea \nhaste\n uptimekuma\n grafana", true)
                .setFooter("Example: DBH!server create-donator NodeJS Testing Server")
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
        postgres: pServerCreatesettings.postgres,
        daystodie: pServerCreatesettings.daystodie,
        arma: pServerCreatesettings.arma,
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
        grafana: pServerCreatesettings.grafana
    };

    if (Object.keys(types).includes(args[1].toLowerCase())) {
        serverCreateSettings_Prem
            .createServer(types[args[1].toLowerCase()])
            .then((response) => {
                userPrem.set(message.author.id + ".used", userP.used + 1);

                let embed = new Discord.MessageEmbed()
                    .setColor(`GREEN`)
                    .addField(`__**Status:**__`, response.statusText)
                    .addField(`__**Created for user ID:**__`, consoleID.consoleID)
                    .addField(`__**Server name:**__`, serverName)
                    .addField(`__**Type:**__`, args[1].toLowerCase())
                    //.addField(`__**Node:**__`, "Node 7 - Boosters/Donators")
                    .addField(
                        `__**WARNING**__`,
                        `**DO NOT USE JAVA TO RUN GAMESERVERS. IF THERE IS A GAME YOU ARE WANTING TO HOST AND IT DOES NOT HAVE A SERVER PLEASE MAKE A TICKET**`
                    );
                message.reply(embed);

                let embed2 = new Discord.MessageEmbed()
                    .setTitle("New donator node server created!")
                    .addField("User:", message.author.id)
                    .addField(`__**Status:**__`, response.statusText)
                    .addField(`__**Created for user ID:**__`, consoleID.consoleID)
                    .addField(`__**Server name:**__`, serverName)
                    .addField(`__**Type:**__`, args[1].toLowerCase())
                    .setFooter("User has " + (userP.used + 1) + " out of a max " + allowed + " servers");
                client.channels.cache.get("898041923544162324").send(embed2);
            })
            .catch((error) => {
                if (error == "AxiosError: Request failed with status code 400") {
                    const embed = new Discord.MessageEmbed()
                        .setColor("RED")
                        .addField(
                            `__**Failed to create a new server**__`,
                            `The Donator node(s) are currently full, Please check <#898327108898684938> for updates. \nIf there is no updates please alert one of the Panel admins (Dan)`
                        );
                    message.reply(embed);
                } else if (error == "AxiosError: Request failed with status code 504") {
                    const embed = new Discord.MessageEmbed()
                        .setColor("RED")
                        .addField(
                            `__**Failed to create a new server**__`,
                            `The Donator node(s) are currently offline or having issues, You can check the status of the node in this channel: <#898327108898684938>`
                        );
                    message.reply(embed);
                } else if (error == "AxiosError: Request failed with status code 429") {
                    const embed = new Discord.MessageEmbed()
                        .setColor("RED")
                        .addField(`__**Failed to create a new server**__`, `Uh oh, This shouldn\'t happen, Try again.`);
                    message.reply(embed);
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setColor("RED")
                        .addField(`__**Failed to create a new server**__`, error);
                    message.reply(embed);
                }
            });
        return;
    } else {
        message.reply(
            new Discord.MessageEmbed()
                .setColor("RED")
                .addField("__**Minecraft:**__", "Forge \nPaper \nBedrock \nPocketmineMP \nWaterfall \nSpigot", true)
                .addField("__**Grand Theft Auto:**__", "alt:V \nmultitheftauto \nRage.MP \nSA-MP", true)
                .addField("__**Languages:**__", "NodeJS \nPython \nJava \naio\n Rust (use rustc to create)", true)
                .addField("__**Bots:**__", "redbot", true)
                .addField("__**Source Engine:**__", "GMod \nCS:GO \nARK:SE", true)
                .addField("__**Voice Servers:**__", "TS3 \nMumble", true)
                .addField("__**SteamCMD:**__", "Rust \nDaystodie \nArma \nAssettocorsa \nAvorion \nBarotrauma", true)
                .addField("__**Databases:**__", "MongoDB \nRedis \nPostgres", true)
                .addField("__**WebHosting:**__", "Nginx", true)
                .addField("__**Custom Eggs:**__", "ShareX", true)
                .addField("__**Software:**__", "codeserver \ngitea \nhaste\n uptimekuma\n grafana", true)
                .setFooter("Example: DBH!server create-donator NodeJS Testing Server")
        );
    }
};
