const serverCreateSettings_Prem = require('../../../../createData_Prem');
const humanizeDuration = require('humanize-duration');

const axios = require('axios');

exports.run = async (client, message, args) => {


    if (client.cooldown[message.author.id] == null) {
        client.cooldown[message.author.id] = {
            nCreate: null,
            pCreate: null,
            delete: null
        }
    }

    let user = userPrem.fetch(message.author.id);

    let boosted;
    axios({
        url: "http://admin.danbot.host:1029",
        method: 'GET',
        headers: {
            "password": config.externalPassword
        },
    }).then(response => {
        boosted = response.data[message.author.id];
    }).catch((e) => {
        // console.log(e);
    }).then(() => {

        const serverName = message.content.split(' ').slice(3).join(' ') || "change me! (Settings -> SERVER NAME)";
        let consoleID = userData.get(message.author.id);

        if (consoleID == null) {
            message.channel.send("Oh no, Seems like you do not have an account linked to your discord ID.\n" +
                "If you have not made an account yet please check out `" +
                config.DiscordBot.Prefix + "user new` to create an account \nIf you already have an account link it using `" +
                config.DiscordBot.Prefix + "user link`");
            return;
        }

        let allowed = (message.member.roles.cache.get('710208090741539006') != null) ? (Math.floor(user.donated / config.node7.price) + (boosted != null ? Math.floor(boosted * 2.5) : 2)) : Math.floor(user.donated / config.node7.price);
        let pServerCreatesettings = serverCreateSettings_Prem.createParams(serverName, consoleID.consoleID);

        if (allowed === 0) {
            message.channel.send("You're not a premium user, to get access to premium you can either boost us for 2 **Premium Servers**, or buy a server (1server/$1)")
            return;
        }

        if ((allowed - user.used) <= 0) {
            message.channel.send("You are at your premium server limit")
            return;
        }

        //Do server creation things
        if (!args[1]) {
            message.channel.send(new Discord.MessageEmbed()
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
                .setFooter("Example: DBH!server create-donator NodeJS Testing Server")
            return;
        }

        if (client.cooldown[message.author.id].pCreate > Date.now()) {
            message.reply(`You're currently on cooldown, please wait ${humanizeDuration(client.cooldown[message.author.id].pCreate - Date.now(), {round: true})}`)
            return;
        }
        client.cooldown[message.author.id].pCreate = Date.now() + (10 * 1000);


        let types = {
            nginx: pServerCreatesettings.nginx,
            reddiscordbot: pServerCreatesettings.reddiscordbot,
            nodejs: pServerCreatesettings.nodejs,
            python: pServerCreatesettings.python,
            aio: pServerCreatesettings.aio,
            java: pServerCreatesettings.java,
            mongodb: pServerCreatesettings.mongodb,
            redis: pServerCreatesettings.redis,
            postgres: pServerCreatesettings.postgres,
            lavalink: pServerCreatesettings.lavalink,
            sharex: pServerCreatesettings.sharex,
        }

        if (Object.keys(types).includes(args[1].toLowerCase())) {
            serverCreateSettings_Prem.createServer(types[args[1].toLowerCase()])
                .then(response => {

                    userPrem.set(message.author.id + '.used', userPrem.fetch(message.author.id).used + 1);

                    let embed = new Discord.MessageEmbed()
                        .setColor(`GREEN`)
                        .addField(`__**Status:**__`, response.statusText)
                        .addField(`__**Created for user ID:**__`, consoleID.consoleID)
                        .addField(`__**Server name:**__`, serverName)
                        .addField(`__**Type:**__`, args[1].toLowerCase())
                        .addField(`__**Node:**__`, "Node 7 - Boosters/Donators")
                        .addField(`__**WARNING**__`, `**DO NOT USE JAVA TO RUN GAMESERVERS. IF THERE IS A GAME YOU ARE WANTING TO HOST AND IT DOES NOT HAVE A SERVER PLEASE MAKE A TICKET**`)
                    message.channel.send(embed)

                    let embed2 = new Discord.MessageEmbed()
                        .setTitle('New donator node server created!')
                        .addField('User:', message.author.id)
                        .addField(`__**Status:**__`, response.statusText)
                        .addField(`__**Created for user ID:**__`, consoleID.consoleID)
                        .addField(`__**Server name:**__`, serverName)
                        .addField(`__**Type:**__`, args[1].toLowerCase())
                        .setFooter('User has ' + (user.used + 1) + ' out of a max ' + allowed + ' servers')
                    client.channels.cache.get("785236066500083772").send(embed2)

                }).catch(error => {
                message.channel.send(new Discord.MessageEmbed().setColor(`RED`).addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`"))
            })
            return;
        }

        message.channel.send(new Discord.MessageEmbed()
            .setColor("RED").setDescription(`List of servers: (use DBH!server create-donator <type> <name>)\n\n*Please note that some nodes might be having trouble connecting to the bot which may lead into this process giving out an error.*\n`)
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
            .setFooter("Example: DBH!server create-donator NodeJS Testing Server")

    })
}
