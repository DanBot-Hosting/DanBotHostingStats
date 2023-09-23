const Discord = require("discord.js");
exports.run = (client, message, args) => {
    // Check if user is William
    if (message.author.id !== "853158265466257448") return;

    if(!args[2]) return message.reply("Please provide a message!");

    const newNick = message.content.split(" ").slice(2).join(" ");

    message.guild.members.get(client.user.id).setNickname(newNick)
};
