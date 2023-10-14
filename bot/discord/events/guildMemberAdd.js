const humanizeDuration = require("humanize-duration");
module.exports = async (client, member, guild) => {
    if (enabled.Welcome === true) {
        let welcomeChannel = client.channels.cache.get(config.DiscordBot.welcome);

        if (Date.now() - member.user.createdAt < 863136000) {
            return;
        } else {
            member.roles.add(config.DiscordBot.roles.member);

            if (userPrem.get(member.id) == null) {
                userPrem.set(member.id, {
                    used: 0,
                    donated: 0,
                });
            }

            if (userData.get(member.id) == null) {
                welcomeChannel.send(
                    "Welcome <@" +
                        member +
                        "> to DanBot Hosting! To get started please read <#898041835002400768> and <#898041837535776788>"
                );
            } else {
                member.roles.add(config.DiscordBot.roles.client);
                welcomeChannel.send("Welcome back <@" + member + "> to DanBot Hosting!");
            }
        }
    }
};
