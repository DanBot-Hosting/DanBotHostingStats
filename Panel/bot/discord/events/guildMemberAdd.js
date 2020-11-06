const config2 = {

    //Channels

    welcome: '738527858594414663',
    inviterewmsg: '738527858594414663',
    invitechannel: '738536628376698981',

    //Invites (Amount: RoleID)

    invites: {
        5: '704650026076602449',
        10: '704650153797091418',
        25: '704650197732556891',
        50: '704650269182394398',
        100: '766873791103238155',
        150: '766873898024828949',
        200: '766873967561539634',
    },

    //Roles

    member: '639490038434103306',
    client: '639489891016638496',
    bot: '704467807122882562',
    mute: '726829710935457872'
}

const humanizeDuration = require('humanize-duration');
const db = require("quick.db");
module.exports = async (client, member, guild) => {
    let welcomeChannel = client.channels.get(config2.welcome);

    if (Date.now() - member.user.createdAt < 863136000) {
        await member.user.send(`Sorry! We only allow accounts over the age of 10days to join. \nYour account is ${humanizeDuration(Date.now() - member.user.createdAt, {round: true})} ago.\n\nYou are welcome to join again once this account is over 10days old!`)
        await member.kick()
        welcomeChannel.send(member.user.tag + ` has been auto-kicked as account is under 10days old.\nThat account was created ${humanizeDuration(Date.now() - member.user.createdAt, {round: true})}, ago`)
    }

    if (member.user.bot) {
        let botID = member.id;
        let bot = db.get(`${botID}`);
        if (!bot) {
            welcomeChannel.send("Bot: " + member + ", tried to join but is not using our API.")
            member.kick();
        } else {
            member.addRole(config2.bot);
            welcomeChannel.send("Welcome " + member + ", More bot friends :D \nBot owned by: <@" + bot.owner + ">");
        }
        return;
    }

    member.addRole(config2.member)
    if (userData.get(member.id) == null) {
        welcomeChannel.send("Welcome " + member + " to DanBot Hosting. To get started please read <#738527470164377630>");
    } else {
        member.addRoles(config2.client)
        welcomeChannel.send("Welcome back " + member + " to DanBot Hosting!");
    }

    if (mutesData.fetch(member.id + ".muted") === "true") {
        member.addRole(config2.mute)
    }

    //Invites

    let guildInvites = await member.guild.fetchInvites()

    const ei = invites[member.guild.id];
    invites[member.guild.id] = guildInvites;
    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
    const inviter = member.guild.members.get(invite.inviter.id);
    if (inviter == null) return;

    let embed = new Discord.RichEmbed()
        .setColor(`GREEN`)
        .addField(`New Members Username:`, member.user.tag, true)
        .addField(`New Members ID:`, '`' + member.id + '`', true)
        .addField('Account created:', member.user.createdAt.toDateString(), true)
        .addField("Members Status", member.user.presence !== null && member.user.presence.status !== null ? member.user.presence.status : "Offline")
        .addField('\u200b', '\u200b')
        .addField(`Invited by:`, inviter.user.tag, true)
        .addField(`Inviter's ID:`, '`' + inviter.id + '`', true)
        .addField(`Invite code used:`, '`' + invite.code + '`', true)
        .addField(`Invite used`, invite.uses + ' times', true);

    client.channels.get(config2.invitechannel).send(embed)

    let inviteChannel = client.channels.get(config2.inviterewmsg);

    if (Object.keys(config2.invites).includes(invite.uses.toString())) {
        await inviter.removeRoles(Object.values(config2.invites))
        inviter.addRole(config2.invites[invite.uses.toString()]).then(() => {
            inviteChannel.send(`<@${inviter.id}> just hit ${invite.uses} invites! Here's a role for you :)`);
        })
    }
}