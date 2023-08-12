const { MessageEmbed } = require("discord.js");

exports.run = (client, message) => {
    if(!message.member.roles.cache.find((r) => r.id === "898041755419693126")) {
        return message.reply("Only beta testers can use this command!");
    }

    const embed = new MessageEmbed()
        .setTitle("DBH VPN Files")
        .setDescription("**URL**: https://cdn.wdh.gg/DBH-VPN/\n**Username**: `dbh`\n**Password**: `betatesters`\n\n**Important Links**:\n[Releases](https://cdn.wdh.gg/DBH-VPN/Releases/) **|** [OVPN Profiles](https://cdn.wdh.gg/DBH-VPN/OVPN-Profiles/)\n\n*Files hosted by [**William**](https://discord.com/users/853158265466257448).*")
        .setFooter("Do not share these details with anyone else!")
        .setColor("BLUE");

    try {
        message.author.send(embed);
        message.reply("Check your DMs!");
    } catch {
        message.reply("I could not DM you!");
    }
};
