const { MessageEmbed } = require("discord.js");

exports.run = (client, message) => {
    const data = userData.get(message.author.id);
    if (!data) return message.reply("You do not have an account.");
    if (!data.domains?.length) return message.reply("You do not have any domains.");

    const embed = new MessageEmbed()
        .setTitle("Your Linked Domains")
        .setDescription(
            data.domains.map((domain, index) => `- ${domain.domain} (Server ID: ${domain.serverID})`).join("\n")
        )
        .setColor("BLUE");
    message.reply(embed);
};
