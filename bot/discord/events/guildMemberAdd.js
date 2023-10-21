const humanizeDuration = require("humanize-duration");
module.exports = async (client, member, guild) => {
    if (enabled.Welcome) {
        if (Date.now() - member.user.createdAt < 863136000) {
            return;
        } else {
            if (userPrem.get(member.id) == null) {
                userPrem.set(member.id, {
                    used: 0,
                    donated: 0,
                });
            }

            if (!userData.get(member.id) == null) {
                member.roles.add(config.DiscordBot.roles.client);
            }
        }
    }
};
