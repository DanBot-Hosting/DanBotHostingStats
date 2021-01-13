module.exports = async (client, oldMember, newMember) => {
    // If user nickname changes.
    if (oldMember.nickname !== newMember.nickname) {

        // Make local vars
        const oldName = oldMember.nickname;
        const newName = newMember.nickname;


        /*
        if (['🎄', '🎅', '🍬', '⛄', '❄️'].some(r => newMember.displayName.includes(r))) newMember.addRole('784992925678960712');
        else if (newMember.roles.get('784992925678960712') != null) newMember.removeRole('784992925678960712');
         */


        if (newMember.nickname === null) {
            newName = newMember.user.username;
        }

        // Make a new RichEmbed
        const embed = new Discord.MessageEmbed()
            .setTitle("User Nickname changed.")
            .setDescription(`User: ${oldMember.user} Nickname has changed.`)
            .addField("Old Nickname", oldName, true)
            .addField("New Nickname", newName, true)
            .setColor(0xFF7700)
            .setTimestamp(new Date());

        //oldMember.setNickname('')
        client.channels.cache.get(config.DiscordBot.oLogs).send(embed)

        return;
    }
};