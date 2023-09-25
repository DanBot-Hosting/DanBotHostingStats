let parse = () => {
    let toReturn = [];
    let reactionRoles = require("../reactionRoles.js");

    let channels = Object.keys(reactionRoles);

    for (let channel of channels) {
        let messages = Object.keys(reactionRoles[channel]);
        messages.forEach((message) => {
            for (let [reaction, role] of Object.entries(reactionRoles[channel][message])) {
                toReturn.push({
                    message: message,
                    reaction: reaction,
                    role: role,
                    channel: channel,
                });
            }
        });
    }
    return toReturn;
};

module.exports = async (client, r, member) => {
    if (member.user.bot == true || r.emoji == null) return;
    let emoji = r.emoji.id != null ? r.emoji.id : r.emoji.name;

    // Reaction Roles
    let reactionRole = parse();
    let found = reactionRole.filter((x) => x.message == r.message.id && x.reaction == emoji);
    if (found.length > 0) {
        found = found[0];
        let role = member.guild.roles.cache.get(found.role);
        if (member.roles.cache.get(found.role) == null) {
            await member.roles.add(role.id);
            member.user.send("Gave you the role: `" + role.name + "`!").catch(() => {});
        }
    }
};
