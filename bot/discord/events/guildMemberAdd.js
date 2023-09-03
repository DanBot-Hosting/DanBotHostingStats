const humanizeDuration = require("humanize-duration");
module.exports = async (client, member, guild) => {
    if (enabled.Welcome === true) {
        let welcomeChannel = client.channels.cache.get(config.DiscordBot.welcome);

        if (Date.now() - member.user.createdAt < 432000000) {
            (await member.ban({
                reason:
                    "Account created under 5 days ago. Created: " +
                    humanizeDuration(Date.now() - member.user.createdAt, {
                        round: true,
                    }),
            })) &&
                welcomeChannel.send(
                    `${member} created under 5 days ago. Created: ` +
                        humanizeDuration(Date.now() - member.user.createdAt, {
                            round: true,
                        })
                );
        } else if (Date.now() - member.user.createdAt < 863136000) {
            await member.user.send(
                `Sorry! We only allow accounts over the age of 10 days to join.\nYour account was created ${humanizeDuration(
                    Date.now() - member.user.createdAt,
                    { round: true }
                )} ago.\n\nYou are welcome to join again once this account is over 10days old!`
            );
            await member.kick();
            welcomeChannel.send(
                member.user.tag +
                    ` has been auto-kicked as account is under 10 days old.\nThat account was created ${humanizeDuration(
                        Date.now() - member.user.createdAt,
                        { round: true }
                    )}, ago`
            );
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

            if (mutesData.get(member.id) != null) {
                member.roles.add(config.DiscordBot.roles.mute);
            }
        }
    }
};
