const serverCreateSettings_Prem = require("../../../../createData_Prem");
const axios = require("axios");

exports.run = async(client, message, args) => {
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
            "user new` to create an account\nIf you already have an account link it using `" +
            config.DiscordBot.Prefix +
            "user link`"
        );
        return;
    }

    let allowed = Math.floor(userP.donated / config.node7.price);

    let pServerCreatesettings = serverCreateSettings_Prem.createParams(serverName, consoleID.consoleID);

    if (allowed === 0) {
        message.reply("You're not a premium user, to get access to premium you can buy a server (2 servers/$1)");
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
                .addField("Minecraft", "Forge\nPaper\nBedrock\nPocketmineMP\nWaterfall\nSpigot\nNukkit\nCurseforge", true)
                .addField("Grand Theft Auto", "alt:V\nmultitheftauto\nRage.MP\nSA-MP", true)
                .addField("Languages", "NodeJS\nPython\nJava\naio\n Rust (use rustc to create)", true)
                .addField("Bots", "redbot", true)
                .addField("Source Engine", "GMod\nCS:GO\nARK:SE", true)
                .addField("Voice Servers", "TS3\nMumble\nLavalink", true)
                .addField("SteamCMD", "Rust\nDaystodie\nAssettocorsa\nAvorion\nBarotrauma\nPalworld\nSCPSL", true)
                .addField("Databases", "MongoDB\nRedis\nPostgres14\nPostgres16\nMariaDB", true)
                .addField("WebHosting", "Nginx", true)
                .addField("Custom Eggs", "ShareX \nOpenX", true)
                .addField("Software", "codeserver\ngitea\nhaste\n uptimekuma\n grafana \nrabbitmq", true)
                // .addField("Storage", "Minio", true)
                .setFooter("Example: DBH!server create-donator aio My AIO Server")
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
        // minio: pServerCreatesettings.minio,
        lavalink: pServerCreatesettings.lavalink,
        rabbitmq: pServerCreatesettings.rabbitmq,
        palworld: pServerCreatesettings.palworld,
        nukkit: pServerCreatesettings.nukkit,
        curseforge: pServerCreatesettings.curseforge,
        scpsl: pServerCreatesettings.scpsl,
    };

    if (Object.keys(types).includes(args[1].toLowerCase())) {
        serverCreateSettings_Prem
            .createServer(types[args[1].toLowerCase()])
            .then((response) => {
                userPrem.set(message.author.id + ".used", userP.used + 1);

                let embed = new Discord.MessageEmbed()
                    .setColor(`GREEN`)
                    .addField(`Status`, response.statusText)
                    .addField(`Created for user ID`, consoleID.consoleID)
                    .addField(`Server name`, serverName)
                    .addField(`Type`, args[1].toLowerCase())
                    //.addField(`Node`, "Node 7 - Boosters/Donators")
                    .addField(
                        `__**WARNING**__`,
                        `Please do not host game servers on java or AIO servers. If you need a gameserver, You need to use Dono2. Slots are 1$ for 2 servers!`
                    );
                message.reply(embed);

                let embed2 = new Discord.MessageEmbed()
                    .setTitle("New donator node server created!")
                    .addField("User:", message.author.id)
                    .addField(`Status`, response.statusText)
                    .addField(`Created for user ID`, consoleID.consoleID)
                    .addField(`Server name`, serverName)
                    .addField(`Type`, args[1].toLowerCase())
                    .setFooter("User has " + (userP.used + 1) + " out of a max " + allowed + " servers");
                client.channels.cache.get("898041923544162324").send(embed2);
            })
            .catch((error) => {
                if (error == "AxiosError: Request failed with status code 400") {
                    const embed = new Discord.MessageEmbed()
                        .setColor("RED")
                        .addField(
                            `__**Failed to create a new server**__`,
                            `The Donator node(s) are currently full, Please check <#898327108898684938> for updates.\nIf there is no updates please alert one of the Panel admins (Dan)`
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
                        .addField(`__**Failed to create a new server**__`, `Some other issue happened. If this continues please open a ticket and report this to a bot admin. Please share this info with them: \nError: ${error}`);
                    message.reply(embed);
                }
            });
        return;
    } else {
        message.reply(
            new Discord.MessageEmbed()
                .setColor("RED")
                .addField("Minecraft", "Forge\nPaper\nBedrock\nPocketmineMP\nWaterfall\nSpigot", true)
                .addField("Grand Theft Auto", "alt:V\nmultitheftauto\nRage.MP\nSA-MP", true)
                .addField("Languages", "NodeJS\nPython\nJava\naio\n Rust (use rustc to create)", true)
                .addField("Bots", "redbot", true)
                .addField("Source Engine", "GMod\nCS:GO\nARK:SE", true)
                .addField("Voice Servers", "TS3\nMumble", true)
                .addField("SteamCMD", "Rust\nDaystodie\nAssettocorsa\nAvorion\nBarotrauma", true)
                .addField("Databases", "MongoDB\nRedis\nPostgres14\nPostgres16\nMariaDB", true)
                .addField("WebHosting", "Nginx", true)
                .addField("Custom Eggs", "ShareX", true)
                .addField("Software", "codeserver\ngitea\nhaste\n uptimekuma\n grafana", true)
                // .addField("Storage", "Minio", true)
                .setFooter("Example: DBH!server create-donator aio My AIO Server")
        );
    }
};