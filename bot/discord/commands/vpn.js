const { MessageEmbed } = require("discord.js");

exports.run = (client, message) => {
    if(!message.member.roles.cache.find((r) => r.id === "898041755419693126")) {
        return message.reply("You do not have permission to execute this command!")
    }

    const embed = new MessageEmbed()
        .setTitle("DBH VPN")
        .setDescription("**URL**: https://cdn.wdh.gg/DBH-VPN/\n**Username**: `dbh`\n**Password**: `betatesters`\n\n**Important Links**:\n[OVPN Profiles](https://cdn.wdh.gg/DBH-VPN/OVPN-Profiles/) **|** [Releases](https://cdn.wdh.gg/DBH-VPN/Releases/)\n\n\n*Hosted by [William Harrison](https://discord.com/users/853158265466257448)*")
        .setFooter("Do not share these details with anyone else!")
        .setColor("BLUE");
    message.author.send(embed);
};
