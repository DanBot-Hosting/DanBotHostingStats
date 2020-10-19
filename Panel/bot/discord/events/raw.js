let findDuplicates = arr => arr.filter((e, i) => arr.indexOf(e) != i)

module.exports = async (client, e) => {

    if (e.t == "MESSAGE_REACTION_ADD") {
        let channel = client.channels.get(e.d.channel_id);
        let message = await channel.fetchMessage(e.d.message_id);
        let emoji = e.d.emoji;
        let member = message.guild.members.get(e.d.user_id);

        if (member.user.bot || client.reactionRoles[channel.id] == null || client.reactionRoles[channel.id][message.id] == null) return;

        let reactionRoles = client.reactionRoles[channel.id][message.id];

        let input = emoji.id != null ? emoji.id : emoji.name;

        if (reactionRoles[input] != null) {
            if (member.roles.find(x => x.id == reactionRoles[input])) {
                await member.removeRole(reactionRoles[input]).catch(console.log(`couldn't find a role with the id ${reactionRoles[input]}`));
                member.user.send("removed the role: `" + role.name + "`!");
            } else {
                await member.addRole(reactionRoles[input]).catch(console.log(`couldn't find a role with the id ${reactionRoles[input]}`));
                member.user.send("gave you the role: `" + role.name + "`!");
            };

            let memberRoles = member.roles.map(x => x.id).concat(Object.values(reactionRoles));
            if (findDuplicates(memberRoles)) member.addRole('765869330024890378')
            else member.removeRole('765869330024890378');
        }

        message.reactions.forEach(reaction => {
            if (e.d.user_id == client.user.id) return;
            else reaction.remove(e.d.user_id)
        })
    }

}