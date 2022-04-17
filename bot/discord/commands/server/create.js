const serverCreateSettings = require('../../../../createData');
exports.run = async(client, message, args) => {

    let helpEmbed = new Discord.MessageEmbed()
        .setColor("RED").setDescription(`List of servers: (use DBH!server create <type> <name>)\n\n*Please note that some nodes might be having trouble connecting to the bot which may lead into this process giving out an error.*\n`)
        //.addField("__**Minecraft:**__", "Forge \nPaper \nBedrock \nPocketmineMP \nWaterfall \nSpigot", true)
        //.addField("__**Grand Theft Auto:**__", "alt:V \nmultitheftauto \nRage.MP \nSA-MP", true)
        .addField("__**Bots:**__", "NodeJS \nPython \nJava \naio \nRedDiscordBot", true)
        //.addField("__**Source Engine:**__", "GMod \nCS:GO \nARK:SE", true)
        .addField("__**Voice Servers:**__", "TS3 \nMumble", true)
        //.addField("__**SteamCMD:**__", "Rust \nDaystodie \nArma \nAssettocorsa \nAvorion \nBarotrauma", true)
        .addField("__**Databases:**__", "MongoDB \nRedis \nPostgres", true)
        .addField("__**WebHosting:**__", "Nginx", true)
        .addField("__**Custom Eggs:**__", "ShareX", true)
        .addField("__**Software:**__", "codeserver \ngitea \nhaste", true)
//         .addField("__**Storage:**__", "storage", true)
        .setFooter("Example: DBH!server create NodeJS Testing Server")

    const serverName = message.content.split(' ').slice(3).join(' ') || "change me! (Settings -> SERVER NAME)";
    let consoleID = userData.get(message.author.id);

    if (consoleID == null) {
        message.channel.send("Oh no, Seems like you do not have an account linked to your discord ID.\n" +
            "If you have not made an account yet please check out `" +
            config.DiscordBot.Prefix + "user new` to create an account \nIf you already have an account link it using `" +
            config.DiscordBot.Prefix + "user link`");
        return;
    }
    let data = serverCreateSettings.createParams(serverName, consoleID.consoleID);

    if (!args[1]) {
        await message.channel.send(helpEmbed);
        return;
    };

    if(args[1] == "list") {
        await message.channel.send(helpEmbed);
        return;
    }

    let types = {
        storage: data.storage,
        nginx: data.nginx,
        reddiscordbot: data.reddiscordbot,
        nodejs: data.nodejs,
        python: data.python,
        aio: data.aio,
        java: data.java,
        //paper: data.paper,
        //forge: data.forge,
        //"alt:v": data.altv,
        //multitheftauto: data.multitheftauto,
        //"rage.mp": data.ragemp,
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
        haste: data.haste
    };


        if (args[1] === "aio" | args[1] === "java") {
            serverCreateSettings.createServer(types[args[1].toLowerCase()])
                .then(response => {
                    let embed = new Discord.MessageEmbed()
                        .setColor(`GREEN`)
                        .addField(`__**Status:**__`, response.statusText)
                        .addField(`__**Created for user ID:**__`, consoleID.consoleID)
                        .addField(`__**Server name:**__`, serverName)
                        .addField(`__**Type:**__`, args[1].toLowerCase())
                        .addField(`__**WARNING**__`, `**DO NOT USE JAVA TO RUN GAMESERVERS. IF THERE IS A GAME YOU ARE WANTING TO HOST AND IT DOES NOT HAVE A SERVER PLEASE MAKE A TICKET**`)
                    message.channel.send(embed)
                }).catch(error => {
                if (error == "Error: Request failed with status code 400") {
                    const embed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .addField(`__**Failed to create a new server**__`, `The node is currently full, Please check <#898327108898684938> for updates. \nIf there is no updates please alert the Panel admin (<@137624084572798976>)`)
                    message.reply(embed)
                } else if (error == "Error: Request failed with status code 504") {
                    const embed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .addField(`__**Failed to create a new server**__`, `The node is currently offline or having issues, You can check the status of the node in this channel: <#898041845878247487>`)
                    message.reply(embed)
                    // console.log(error)
                } else if (error == "Error: Request failed with status code 429") {
                    const embed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .addField(`__**Failed to create a new server**__`, `Uh oh, This shouldn\'t happen, Try again in a minute or two.`)
                    message.reply(embed)
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .addField(`__**Failed to create a new server**__`, error)
                    message.reply(embed)
                }
            })
        } else {
            serverCreateSettings.createServer(types[args[1].toLowerCase()])
                .then(response => {
                    let embed = new Discord.MessageEmbed()
                        .setColor(`GREEN`)
                        .addField(`__**Status:**__`, response.statusText)
                        .addField(`__**Created for user ID:**__`, consoleID.consoleID)
                        .addField(`__**Server name:**__`, serverName)
                        .addField(`__**Type:**__`, args[1].toLowerCase())
                    message.reply(embed)
                }).catch(error => {
                if (error == "Error: Request failed with status code 400") {
                    const embed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .addField(`__**Failed to create a new server**__`, `The node is currently full, Please check <#898327108898684938> for updates. \nIf there is no updates please alert one of the Panel admins (Dan)`)
                    message.reply(embed)
                } else if (error == "Error: Request failed with status code 504") {
                    const embed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .addField(`__**Failed to create a new server**__`, `The node is currently offline or having issues, You can check the status of the node in this channel: <#898327108898684938>`)
                    message.reply(embed)
                } else if (error == "Error: Request failed with status code 429") {
                    const embed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .addField(`__**Failed to create a new server**__`, `Uh oh, This shouldn\'t happen, Try again.`)
                    message.reply(embed)
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .addField(`__**Failed to create a new server**__`, error)
                    message.reply(embed)
                }
            })
        }

    //message.reply('Server creation s currently disabled. We are upgrading our servers and making lots of new changes to bring new features! Stay tuned by checking News!')
}
