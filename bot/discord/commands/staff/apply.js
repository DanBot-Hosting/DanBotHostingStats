exports.run = async(client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id === "898041741695926282")) return;

    if (args[1] == null) {
        message.channel.send("Please run the command using the following format: `" + config.DiscordBot.Prefix + "staff apply open/close` to enable or disable staff applications")
    } else {
        if (args[1] === "open") {
            webSettings.set("staff-applications", {
                enabled: "true"
            });
            message.channel.send("Staff applications now open")
        } else if (args[1] === "close") {
            webSettings.set("staff-applications", {
                enabled: "false"
            });
            message.channel.send("Staff applications now closed")
        } else {
            if (webSettings.fetch("staff-applications.enabled") === "true") {
                message.channel.send("Please run the command using the following format: `" + config.DiscordBot.Prefix + "staff apply open/close` to enable or disable staff applications \n**Staff applications are currently:** **OPEN**");
            } else if (webSettings.fetch("staff-applications.enabled") === "false") {
                message.channel.send("Please run the command using the following format: `" + config.DiscordBot.Prefix + "staff apply open/close` to enable or disable staff applications \n**Staff applications are currently:** **CLOSED**");
            }
        }
    }
}
