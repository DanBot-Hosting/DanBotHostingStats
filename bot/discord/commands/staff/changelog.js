exports.init = (client, message, args) => {
    // Check if user has the staff role
    if (!message.member.roles.cache.find((r) => r.id === "898041751099539497")) return;

    try {
        if(!args[1]) return message.reply("Please provide a message!");

        const msg = message.content.split(" ").slice(1).join(" ");

        const embed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor(message.author.tag.endsWith("#0") ? message.author.username : message.author.tag, message.author.displayAvatarURL({ format: "png", dynamic: true }), `https://discord.com/users/${message.author.id}`)
            .setDescription(msg)
            .setTimestamp();
        client.channels.cache.get("898041904208429116").send(embed);
        message.reply("Changelog sent!");
    } catch(err) {
        message.channel.send(`\`\`\`${err.message}\`\`\``);
    }
};
