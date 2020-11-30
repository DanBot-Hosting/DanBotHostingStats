let parse = () => {
    let toReturn = [];

    let channels = Object.keys(config.DiscordBot.reactionRoles);

    for (let channel of channels) {
        let messages = Object.keys(config.DiscordBot.reactionRoles[channel])
        messages.forEach(message => {
            for (let [reaction, role] of Object.entries(config.DiscordBot.reactionRoles[channel][message])) {

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
    // if (member.user.bot == true) return;

    // let emoji = r.emoji.id != null ? r.emoji.id : r.emoji.name;
    // let reactionRole = parse();

    // // Reaction Roles
    // let found = reactionRole.find(x => x.message == r.message.id && x.reaction == emoji);
    // if (found != null) {
    //     let role = member.guild.roles.get(found.role);
    //     console.log("removed the role: `" + role.name + "`!");
    //     await member.addRole(role);
    //     member.user.send("removed the role: `" + role.name + "`!");
    //     let memberRoles = member.roles.map(x => x.id).concat(reactionRole.map(x => x.role))
    //     let dupped = memberRoles.filter((e, i) => memberRoles.indexOf(e) != i);
    //     if(dupped.length == 0) member.removeRole('765869330024890378')
    // }
}