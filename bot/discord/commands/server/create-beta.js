const serverCreateSettings_Beta = require("../../../createData_Beta");

exports.run = async (client, message, args) => {

    message.channel.send("There is currently not Beta at the moment. Keep any eye out in <#898041876219830442>!");

    // if (client.cooldown[message.author.id] == null) {
    //     client.cooldown[message.author.id] = {
    //         nCreate: null,
    //         pCreate: null,
    //         delete: null
    //     }
    // }
    /*
        if(message.member.roles.cache.some(r=>['793549158417301544', '710208090741539006', '788193704014905364'].includes(r.id)) ) {

            let bServerCreatesettings = serverCreateSettings_Beta.createParams(serverName, consoleID.consoleID);

            //Do server creation things
            if (!args[1]) {
                message.reply(new Discord.MessageEmbed()
                    .setColor(`RED`).setDescription(`List of servers: (use ${config.DiscordBot.Prefix}server create <type> <name>)`)
                    .addField(`__**Minecraft:**__`, "Forge \nPaper \nBedrock \nPocketmineMP", true)
                    .addField(`__**Grand Theft Auto:**__`, "FiveM \nalt:V \nmultitheftauto \nRage.MP \nSA-MP", true)
                    .addField(`__**Source Engine:**__`, "GMod \nCS:GO \nARK:SE", true)
                    .addField(`__**SteamCMD:**__`, "Rust", true)
                    .setFooter("Example: " + config.DiscordBot.Prefix + "server create-beta NodeJS Testing Server"))
                return;
            }

            if (client.cooldown[message.author.id].pCreate > Date.now()) {
                message.reply(`You're currently on cooldown, please wait ${humanizeDuration(client.cooldown[message.author.id].pCreate - Date.now(), {round: true})}`)
                return;
            }
            client.cooldown[message.author.id].pCreate = Date.now() + (10 * 1000);


            let types = {
                paper: bServerCreatesettings.paper,
                forge: bServerCreatesettings.forge,
                fivem: bServerCreatesettings.fivem,
                "alt:v": bServerCreatesettings.altv,
                multitheftauto: bServerCreatesettings.multitheftauto,
                "rage.mp": bServerCreatesettings.ragemp,
                "sa-mp": bServerCreatesettings.samp,
                bedrock: bServerCreatesettings.bedrock,
                pocketminemp: bServerCreatesettings.pocketminemp,
                gmod: bServerCreatesettings.gmod,
                "cs:go": bServerCreatesettings.csgo,
                "ark:se": bServerCreatesettings.arkse,
                rust: bServerCreatesettings.rust,
            }

            if (Object.keys(types).includes(args[1].toLowerCase())) {
                serverCreateSettings_Beta.createServer(types[args[1].toLowerCase()])
                    .then(response => {
                        let embed = new Discord.MessageEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, consoleID.consoleID)
                            .addField(`__**Server name:**__`, serverName)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                            .addField(`__**Node:**__`, "Node 8 - BETA")
                        message.reply(embed)

                    }).catch(error => {
                    message.reply(new Discord.MessageEmbed().setColor(`RED`).addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`"))
                })
                return;
            }

            message.reply(new Discord.MessageEmbed()
                .setColor(`RED`).setDescription(`List of servers: (use ${config.DiscordBot.Prefix}server create <type> <name>)`)
                .addField(`__**Minecraft:**__`, "Forge \nPaper \nBedrock \nPocketmineMP", true)
                .addField(`__**Grand Theft Auto:**__`, "FiveM \nalt:V \nmultitheftauto \nRage.MP \nSA-MP", true)
                .addField(`__**Source Engine:**__`, "GMod \nCS:GO \nARK:SE", true)
                .addField(`__**SteamCMD:**__`, "Rust", true)
                .setFooter("Example: " + config.DiscordBot.Prefix + "server create-beta NodeJS Testing Server"))

        }

         */
};
