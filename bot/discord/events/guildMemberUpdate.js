module.exports = async(client, oldMember, newMember) => {
    // If user nickname changes.
    if (oldMember.displayName != newMember.displayName) {
        let displayName = newMember.displayName.toLowerCase();

        //if (displayName.includes("soloisaslut")) {
        //    return newMember.setNickname(newMember.displayName.replace(/soloisaslut/i, "SoloIsAHottie"), "Naughty...");
        //}
        
        const hoisting = new RegExp("^[a-z0-9]", "i");
        const website = new RegExp("(((?!\-))(xn\-\-)?[a-z0-9\-_]{0,61}[a-z0-9]{1,1}\.)*(xn\-\-)?([a-z0-9\-]{1,61}|[a-z0-9\-]{1,30})\.[a-z]{2,}", "i");

        if (!displayName.match(hoisting) || displayName.match(website)) {
            return newMember.setNickname('I love Dan <3');
        }

        if (['hilter', 'jew', 'discord.gg', 'discordapp', 'aids'].some(r => displayName.includes(r))) {
            newMember.setNickname('Moderated Nickname');
        }

        // Make a new RichEmbed
        const embed = new Discord.MessageEmbed()
            .setTitle("User Nickname changed.")
            .setDescription(`User: ${oldMember} Nickname has changed.`)
            .addField("Old Nickname", oldMember.displayName, true)
            .addField("New Nickname", newMember.displayName, true)
            .setColor(0xFF7700)
            .setTimestamp(new Date());

        client.channels.cache.get(config.DiscordBot.oLogs).send(embed)
    }
};
