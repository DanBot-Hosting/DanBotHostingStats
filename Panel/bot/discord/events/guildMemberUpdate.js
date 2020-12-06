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

        if (['🎄', '🎅', '🍬', '⛄', '❄️'].some(r => newMember.displayName.includes(r))) newMember.addRole('784992925678960712');
        else if (newMember.roles.get('784992925678960712') != null) newMember.removeRole('784992925678960712');


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
        } else if (newName.includes("!")) {
            oldMember.setNickname("I'm a furry OwO")
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
    }
};