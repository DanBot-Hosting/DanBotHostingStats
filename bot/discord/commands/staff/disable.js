exports.run = async(client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id === "898041741695926282")) return;

    if (args[1] == null) {
        message.channel.send("Please run the command using the following format: `" + config.DiscordBot.Prefix + "staff disable message/off` to enable or disable the bot")
    } else {
        if (args[1].toLowerCase() == "off") {
            message.channel.send("Bot commands are now enabled");

            webSettings.set('commands', false);

        } else {
            message.channel.send("Bot commands are now disabled! reason: `" + args.slice(1).join(' ') + "`");
            webSettings.set('commands', args.slice(1).join(' '));

        }

    }
}
