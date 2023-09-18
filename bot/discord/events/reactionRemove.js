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
    if (r == null) return;
    if (member.user.bot == true || r.emoji == null) return;
    let emoji = r.emoji.id != null ? r.emoji.id : r.emoji.name;

    // Reaction Roles
    let reactionRole = parse();
    let found = reactionRole.find((x) => x.message == r.message.id && x.reaction == emoji);

    if (found == null) return;

    let role = member.guild.roles.cache.get(found.role);
    if (member.roles.cache.get(found.role) != null) {
        await member.roles.remove(role);
        member.user.send("Removed the role: `" + role.name + "`!").catch(() => {});
        let memberRoles = member.roles.cache.map((x) => x.id).concat(reactionRole.map((x) => x.role));
        let dupped = memberRoles.filter((e, i) => memberRoles.indexOf(e) != i);
        if (dupped.length == 0) member.roles.remove("765869330024890378");
    }
};
