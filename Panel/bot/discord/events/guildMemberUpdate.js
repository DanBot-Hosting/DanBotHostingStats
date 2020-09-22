module.exports = async (client, oldMember, newMember) => {
    // If user nickname changes.
    if (oldMember.nickname !== newMember.nickname) {

        // Make local vars
        var oldName = oldMember.nickname;
        var newName = newMember.nickname;

        // If no set nickname, use the user's username.
        if (oldMember.nickname === null) {
            oldName = oldMember.user.username;
        }
        if (newMember.nickname === null) {
            newName = newMember.user.username;
        }
        const a = "\u200B";
        if (newName.includes(" ឵឵")) {
            oldMember.setNickname('')
        } else if (newName.includes("͔")) {
            oldMember.setNickname("")
        } else if (newName.includes(" ឵឵")) {
            oldMember.setNickname("")
        } else if (newName.includes(a)) {
            oldMember.setNickname("")
        }

        // Make a new RichEmbed
        const embed = new Discord.RichEmbed()
            .setTitle("User Nickname changed.")
            .setThumbnail(`${oldMember.user.displayAvatarURL}`)
            .setDescription(`User: ${oldMember.user} Nickname has changed.`)
            .addField("Old Nickname", oldName, true)
            .addField("New Nickname", newName, true)
            .setColor(0xFF7700)
            .setTimestamp(new Date());

        //oldMember.setNickname('')
        client.channels.get(config.DiscordBot.oLogs).send(embed)

        return;
    } else if (oldMember.roles !== newMember.roles) {

        // Make local vars.
        var oldRoles = [];
        var newRoles = [];

        // Get the roles from the user and push to our local vars.
        oldMember.roles.forEach(function (k) {
            oldRoles.push(k.name);
        });
        newMember.roles.forEach(function (k) {
            newRoles.push(k.name);
        });

        // If a role was Added.
        if (oldRoles.length < newRoles.length) {
            var addedChange = filterArray(newRoles, oldRoles)[0];

            // Make a new RichEmbed
            const embed = new Discord.RichEmbed()
                .setTitle("User Role changed.")
                .setThumbnail(`${oldMember.user.displayAvatarURL}`)
                .setDescription("User: " + oldMember + " has gained the role: " + addedChange)
                .setColor(0xFF7700)
                .setTimestamp(new Date());


            client.channels.get(config.DiscordBot.oLogs).send(embed)

        }
    } else {
        var removedChange = filterArray(oldRoles, newRoles)[0];

        // Make a new RichEmbed
        const embed = new Discord.RichEmbed()
            .setTitle("User Role changed.")
            .setThumbnail(`${oldMember.user.displayAvatarURL}`)
            .setDescription("User: " + oldMember + " has lost the role: " + removedChange)
            .setColor(0xFF7700)
            .setTimestamp(new Date());

        client.channels.get(config.DiscordBot.oLogs).send(embed)

    }
};