const Discord = require("discord.js");
exports.run = (client, message, args) => {
    // Check if user has the staff role
    if (!message.member.roles.cache.find((r) => r.id === "898041751099539497")) return;

    if(!args[1]) return message.reply("Please provide a message!");

    const msg = message.content.split(" ").slice(2).join(" ");

    const embed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor(message.author.tag.endsWith("#0") ? message.author.username : message.author.tag, message.author.displayAvatarURL({ format: "png", dynamic: true }), `https://discord.com/users/${message.author.id}`)
        .setDescription(msg)
        .setTimestamp();
    client.channels.cache.get("960242064338092202").send(embed);
    message.reply("Changelog sent!");
};
