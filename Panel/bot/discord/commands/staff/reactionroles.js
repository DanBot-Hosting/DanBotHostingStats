exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id === "778237595477606440")) return;

    message.channel.send("Reloading reaction roles...")
    let reactionRoles = config.DiscordBot.reactionRoles

    let reactionRolesChannels = Object.keys(reactionRoles);
    reactionRolesChannels.forEach(c => {
        let rchannel = client.channels.cache.get(c);
        let reactionRolesChannelMessages = Object.keys(reactionRoles[c]);

        reactionRolesChannelMessages.forEach(async m => {
            let rmessage = await rchannel.messages.fetch(m);
            let reactions = Object.keys(reactionRoles[c][m]);
            await rmessage.reactions.removeAll();

            for (let ri in reactions) {
                let reaction = reactions[ri];
                if (reaction.length === 18) reaction = client.emojis.cache.get(reaction);
                await rmessage.react(reaction);
            }
            message.channel.send("Done reloading reaction roles...");

        });
    })
}