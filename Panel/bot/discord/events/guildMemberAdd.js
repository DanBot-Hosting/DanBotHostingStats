const config = {
    "welcome": "704648079361573024",
    "inviterewmsg": "704648079361573024",
    "invite5": "704650026076602449",
    "invite10": "704650153797091418",
    "invite25": "704650197732556891",
    "invite50": "704650269182394398",
    "invitechannel": "704650867642597468",
    "member": "639490038434103306"
}

module.exports = async(client, member, guild) => {
    const memberrole = member.guild.roles.find(role => role.id === config.member);
    member.guild.members.get(member.user.id).addRole(memberrole)
    client.channels.get(config.welcome).send("Welcome <@" + member.user.id + "> to DanBot Hosting. To get started please read <#640158484985413632>");

    member.guild.fetchInvites().then(guildInvites => {
        const ei = invites[member.guild.id];
        invites[member.guild.id] = guildInvites;
        const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
        const inviter = client.users.get(invite.inviter.id);
        client.channels.get(config.invitechannel).send(`${member.user.tag} (ID: ${member.user.id}) joined using invite code ` + "`" + invite.code + "`" + ` from ${inviter.tag} (ID: ${inviter.id}). Invite code has been used ${invite.uses} times.`);
        const invite5 = member.guild.roles.find(role => role.id === config.invite5);
        const invite10 = member.guild.roles.find(role => role.id === config.invite10);
        const invite25 = member.guild.roles.find(role => role.id === config.invite25);
        const invite50 = member.guild.roles.find(role => role.id === config.invite50);
        if (invite.uses == 5) return member.guild.members.get(inviter.id).addRole(invite5), client.channels.get(config.inviterewmsg).send(`<@${inviter.id}> just hit 5 invites! Here's a role for you :)`);
        if (invite.uses == 10) return member.guild.members.get(inviter.id).removeRole(invite5), member.guild.members.get(inviter.id).addRole(invite10), client.channels.get(config.inviterewmsg).send(`<@${inviter.id}> just hit 10 invites! Here's a role for you :)`);;
        if (invite.uses >= 25) return member.guild.members.get(inviter.id).removeRole(invite10), member.guild.members.get(inviter.id).addRole(invite25), client.channels.get(config.inviterewmsg).send(`<@${inviter.id}> just hit 25 invites! Here's a role for you :)`);;
        if (invite.uses >= 50) return member.guild.members.get(inviter.id).removeRole(invite25), member.guild.members.get(inviter.id).addRole(invite50), client.channels.get(config.inviterewmsg).send(`<@${inviter.id}> just hit 50 invites! Here's a role for you :)`);;
      });
};