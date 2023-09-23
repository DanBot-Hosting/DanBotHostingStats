const Discord = require("discord.js");
exports.run = (client, message, args) => {
    try {
        // Check if user is William
        if (message.author.id !== "853158265466257448") return;

        if(!args[2]) return message.reply("Please provide a user ID!");
        if(!args[3]) return message.reply("Please provide a message!");

        const userId = args[2];
        const newNick = message.content.split(" ").slice(3).join(" ");

        const user = message.guild.members.cache.get(userId);

        user.setNickname(newNick);
        message.reply(`User nickname set to \`${newNick}\``);
    } catch(err) {
        message.reply(err.message);
    }
};
