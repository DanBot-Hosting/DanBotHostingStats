exports.run = (client, message, args) => {
    // Check if user has the dev role
    if (!message.member.roles.cache.find((r) => r.id === "898041747597295667")) return;
    // Check the message is in the #dev-questions channel
    if(message.channel.id !== "1083142107977486389") return message.reply("This command can only be used in <#1083142107977486389>!");
    // Command can only be used every 30 minutes
    if(pollPingLastUsed + 1800000 > Date.now()) return message.reply(`This command can only be used every 30 minutes! Cooldown expires <t:${(pollPingLastUsed + 1800000).toString().slice(0, -3)}:R>`)

    message.reply("<@&898041781927682090>");
    global.pollPingLastUsed = Date.now();
};
