const serverCreateSettings_Prem = require('../../../../createData_Prem');
const axios = require('axios');

exports.run = async (client, message, args) => {

    let userP = userPrem.fetch(message.author.id) || { used: 0 };

    let boosted = await axios({
        url: "http://admin.danbot.host:1029",
        timeout: 3000,
        method: 'GET',
        headers: {
            "password": config.externalPassword
        },
    }).catch(e => {
        console.log(e);
    })

    const serverName = message.content.split(' ').slice(3).join(' ') || "change me! (Settings -> SERVER NAME)";
    let consoleID = userData.get(message.author.id);

    if (consoleID == null) {
        message.channel.send("Oh no, Seems like you do not have an account linked to your discord ID.\n" +
            "If you have not made an account yet please check out `" +
            config.DiscordBot.Prefix + "user new` to create an account \nIf you already have an account link it using `" +
            config.DiscordBot.Prefix + "user link`");
        return;
    }

    let allowed = Math.floor(userP.donated / config.node7.price) + ((boosted != null && boosted.data[message.author.id] != null) ? Math.floor(boosted.data[message.author.id] * 2.5) : ((message.member.roles.cache.get('710208090741539006') != null) ? 2 : 0));

    let pServerCreatesettings = serverCreateSettings_Prem.createParams(serverName, consoleID.consoleID);

    if (allowed === 0) {
        message.channel.send("You're not a premium user, to get access to premium you can either boost us for 2 **Premium Servers**, or buy a server (1server/$1)")
        return;
    }

    if ((allowed - userP.used) <= 0) {
        message.channel.send("You are at your premium server limit")
        return;
    }

    //Do server creation things
    if (!args[1]) {
        message.channel.send({embeds: [new Discord.MessageEmbed()
            .setColor("RED")
            .addField("__**Minecraft:**__", "Forge \nPaper \nBedrock \nPocketmineMP \nWaterfall \nSpigot", true)
            .addField("__**Grand Theft Auto:**__", "FiveM \nalt:V \nmultitheftauto \nRage.MP \nSA-MP", true)
            .addField("__**Bots:**__", "NodeJS \nPython \nJava \naio \nRedDiscordBot", true)
            .addField("__**Source Engine:**__", "GMod \nCS:GO \nARK:SE", true)
            .addField("__**Voice Servers:**__", "TS3 \nMumble \nLavalink", true)
            .addField("__**SteamCMD:**__", "Rust \nDaystodie \nArma \nAssettocorsa \nAvorion \nBarotrauma", true)
            .addField("__**Databases:**__", "MongoDB \nRedis \nPostgres", true)
            .addField("__**WebHosting:**__", "Nginx", true)
            .addField("__**Custom Egg:**__", "ShareX", true)
            .addField("__**Storage:**__", "storage", true)
            .setFooter("Example: DBH!server create-donator NodeJS Testing Server")]})
        return;
    }

    let types = {
        storage: pServerCreatesettings.storage,
        nginx: pServerCreatesettings.nginx,
        reddiscordbot: pServerCreatesettings.reddiscordbot,
        nodejs: pServerCreatesettings.nodejs,
        python: pServerCreatesettings.python,
        aio: pServerCreatesettings.aio,
        java: pServerCreatesettings.java,
        paper: pServerCreatesettings.paper,
        forge: pServerCreatesettings.forge,
        fivem: pServerCreatesettings.fivem,
        "alt:v": pServerCreatesettings.altv,
        multitheftauto: pServerCreatesettings.multitheftauto,
        "rage.mp": pServerCreatesettings.ragemp,
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
        lavalink: pServerCreatesettings.lavalink,
        sharex: pServerCreatesettings.sharex
    }

    if (Object.keys(types).includes(args[1].toLowerCase())) {
        serverCreateSettings_Prem.createServer(types[args[1].toLowerCase()])
            .then(response => {

                userPrem.set(message.author.id + '.used', userP.used + 1);

                let embed = new Discord.MessageEmbed()
                    .setColor(`GREEN`)
                    .addField(`__**Status:**__`, response.statusText)
                    .addField(`__**Created for user ID:**__`, consoleID.consoleID)
                    .addField(`__**Server name:**__`, serverName)
                    .addField(`__**Type:**__`, args[1].toLowerCase())
                    //.addField(`__**Node:**__`, "Node 7 - Boosters/Donators")
                    .addField(`__**WARNING**__`, `**DO NOT USE JAVA TO RUN GAMESERVERS. IF THERE IS A GAME YOU ARE WANTING TO HOST AND IT DOES NOT HAVE A SERVER PLEASE MAKE A TICKET**`)
                message.channel.send({embeds: [embed]})

                let embed2 = new Discord.MessageEmbed()
                    .setTitle('New donator node server created!')
                    .addField('User:', message.author.id)
                    .addField(`__**Status:**__`, response.statusText)
                    .addField(`__**Created for user ID:**__`, consoleID.consoleID)
                    .addField(`__**Server name:**__`, serverName)
                    .addField(`__**Type:**__`, args[1].toLowerCase())
                    .setFooter('User has ' + (userP.used + 1) + ' out of a max ' + allowed + ' servers')
                client.channels.cache.get("785236066500083772").send({embeds: [embed2]})

            }).catch(error => {
                message.channel.send({embeds: [new Discord.MessageEmbed().setColor(`RED`).addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")]})
            })
        return;
    }

    message.channel.send({embeds: [new Discord.MessageEmbed()
        .setColor("RED")
        .setDescription(`List of servers: (use DBH!server create-donator <type> <name>)\n\n*Please note that some nodes might be having trouble connecting to the bot which may lead into this process giving out an error.*\n`)
        .addField("__**Minecraft:**__", "Forge \nPaper \nBedrock \nPocketmineMP \nWaterfall \nSpigot", true)
        .addField("__**Grand Theft Auto:**__", "FiveM \nalt:V \nmultitheftauto \nRage.MP \nSA-MP", true)
        .addField("__**Bots:**__", "NodeJS \nPython \nJava \naio \nRedDiscordBot", true)
        .addField("__**Source Engine:**__", "GMod \nCS:GO \nARK:SE", true)
        .addField("__**Voice Servers:**__", "TS3 \nMumble \nLavalink", true)
        .addField("__**SteamCMD:**__", "Rust \nDaystodie \nArma \nAssettocorsa \nAvorion \nBarotrauma", true)
        .addField("__**Databases:**__", "MongoDB \nRedis \nPostgres", true)
        .addField("__**WebHosting:**__", "Nginx", true)
        .addField("__**Custom Egg:**__", "ShareX", true)
        //.addField(__**Storage:**__, "storage", true)
        .setFooter("Example: DBH!server create-donator NodeJS Testing Server")]})

}
