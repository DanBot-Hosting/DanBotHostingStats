let parse = () => {
    let toReturn = [];

    let channels = Object.keys(config.reactionRoles);

    for (let channel of channels) {
        let messages = Object.keys(config.reactionRoles[channel])
        messages.forEach(message => {
            for (let [reaction, role] of Object.entries(config.reactionRoles[channel][message])) {

                toReturn.push({
                    message: message,
                    reaction: reaction,
                    role: role,
                    channel: channel
                })
            }
        })
    }
    return toReturn;
}


module.exports = async (client, r, member) => {

    if (member.user.bot == true) return;

    let emoji = r.emoji.id != null ? r.emoji.id : r.emoji.name;
    let reactionRole = parse();

    // Reaction Roles
    let found = reactionRole.find(x => x.message == r.message.id && x.reaction == emoji);
    if (found != null) {
        let role = member.guild.roles.get(found.role);
        console.log("gave you the role: `" + role.name + "`!");
        await member.addRoles([role, '765869330024890378']);
        member.user.send("gave you the role: `" + role.name + "`!");
    }

}