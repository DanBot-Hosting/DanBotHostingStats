const Discord = require("discord.js");
exports.run = (client, message, args) => {
    // Check if user has the dev role
    if (!message.member.roles.cache.find((r) => r.id === "898041747597295667")) return;
    // Check the message is in the #dev-questions channel
    if(message.channel.id !== "1083142107977486389") return message.reply("This command can only be used in <#1083142107977486389>!");

    message.reply("<@&898041781927682090>");
};
