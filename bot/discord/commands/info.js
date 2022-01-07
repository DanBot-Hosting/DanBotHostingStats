let db = require("quick.db");
const Discord = require("discord.js");

exports.run = async(client, message, args) => {

    let botID = args[0];
    if (message.mentions.users.first()) {
        let t = message.mentions.users.first();
        botID = t.id;
    };

    if (!botID) return message.channel.send("Error: Invalid command format! \n`" + config.DiscordBot.Prefix + "info botid`");
    let bot = db.get(`${botID}`);

    let sendinfo = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setTitle(`DanBot Hosting`)
        .setDescription("The bot id you provided is not in my database! Confused? Read below.")
        .addField("Sent data to the website, and it still shows this?", "Please ping Dan (if he is active) or one of the mods to help you", true)
        .addField("What database?", "If you looking to add your bot here, you must post your stats to the npm. How do I post it? [Click me](https://canary.discord.com/channels/639477525927690240/738548111323955270/738551079343620166)", true)

    if (!bot) return message.channel.send(sendinfo);
    if (bot.deleted) return message.channel.send("Error: This bot has been deleted.");

    let infoEmbed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setTitle(`${bot.client.username} | DanBot Hosting Stats`)
        .setURL("https://danbot.host/bot/" + bot.id)
        .setThumbnail(`https://cdn.discordapp.com/avatars/${bot.id}/${bot.client.avatar}`)
        .setDescription(`
        **Status:** ${bot.status}
        **Servers:** ${bot.servers.toLocaleString()}
        **Users:** ${bot.users.toLocaleString()}
        `)
        .addField("Owner", `<@${bot.owner}> \`(${bot.owner})\``)
        .addField("Invite", "[Click Me!](<https://discord.com/oauth2/authorize?client_id=" + bot.id + "&permissions=0&scope=bot>)")

    if (bot) return message.channel.send(infoEmbed)

};
