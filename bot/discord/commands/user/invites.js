exports.run = async (client, message, args) => {
    let targetUser = null;
    let isAnotherUserLookup = false;
    if (message.mentions.members.first() != null) {
        targetUser = message.mentions.members.first().user;
        isAnotherUserLookup = true;
    } else targetUser = message.author;

    message.guild
        .fetchInvites()
        .then((invites) => {
            const userInvites = invites.array().filter((o) => o.inviter.id === targetUser.id);
            var userInviteCount = 0;
            for (var i = 0; i < userInvites.length; i++) {
                var invite = userInvites[i];
                userInviteCount += invite["uses"];
            }
            if (isAnotherUserLookup)
                message.reply(`User \`_${targetUser.username}_\` has invited ${userInviteCount} users`);
            else message.reply(`You have invited ${userInviteCount} users to this server. `);
        })
        .catch(console.error);
};
