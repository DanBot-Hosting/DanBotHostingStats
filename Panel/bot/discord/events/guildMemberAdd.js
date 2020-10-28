const config2 = {
    "welcome": "738527858594414663",
    "inviterewmsg": "738527858594414663",
    "invite5": "704650026076602449",
    "invite10": "704650153797091418",
    "invite25": "704650197732556891",
    "invite50": "704650269182394398",
    "invite100": "766873791103238155",
    "invite150": "766873898024828949",
    "invite200": "766873967561539634",
    "invitechannel": "738536628376698981",
    "member": "639490038434103306",
    "bot": "704467807122882562"
}

const Canvas = require("canvas");
const db = require("quick.db");
module.exports = async(client, member, guild) => {

    var getAge = function(millis) {
        var dur = {};
        var units = [{
                label: "milliseconds",
                mod: 1000
            },
            {
                label: "seconds",
                mod: 60
            },
            {
                label: "minutes",
                mod: 60
            },
            {
                label: "hours",
                mod: 24
            },
            {
                label: "days",
                mod: 31
            }
        ];
    
        units.forEach(function(u) {
            millis = (millis - (dur[u.label] = (millis % u.mod))) / u.mod;
        });
    
        var nonZero = function(u) {
            return dur[u.label];
        };
        dur.toString = function() {
            return units
                .reverse()
                .filter(nonZero)
                .map(function(u) {
                    return dur[u.label] + " " + (dur[u.label] == 1 ? u.label.slice(0, -1) : u.label);
                })
                .join(', ');
        };
        return dur;
    };

        if (Date.now() - member.user.createdAt < 863136000) {
          member.kick().then(memberkicked => {
              client.channels.get('738527858594414663').send(member.user.tag + ` has been auto-kicked as account is under 10days old \nThat account was created ${getAge(Date.now() - member.user.createdAt)}, ago`)
              client.users.get(member.user.id).send('Sorry! We only allow accounts over the age of 10days to join. \nYou\'r account is ' + getAge(Date.now() - member.user.createdAt) + ", ago. \n\nYou are welcome to join again once this account is over 10days old!")
          });
        }
    
        if(member.user.bot) {
            let botID = member.user.id;
            let bot = db.get(`${botID}`);
            if(!bot) {
                client.channels.get(config2.welcome).send("Bot: <@" + member.user.id + ">, tried to join but is not using our API.")
                member.kick();
            } else {
                const botrole = member.guild.roles.find(role => role.id === config2.bot);
                member.guild.members.get(member.user.id).addRole(botrole);
                client.channels.get(config2.welcome).send("Welcome <@" + member.user.id + ">, More bot friends :D \nBot owned by: <@" + bot.owner + ">");
            }
    } else {
        if (userData.get(member.user.id) == null) {
            const memberrole = member.guild.roles.find(role => role.id === config2.member);
            member.guild.members.get(member.user.id).addRole(memberrole)
            client.channels.get(config2.welcome).send("Welcome <@" + member.user.id + "> to DanBot Hosting. To get started please read <#738527470164377630>");    
        } else {
            const memberrole = member.guild.roles.find(role => role.id === config2.member);
            const clientrole = member.guild.roles.find(role => role.id === "639489891016638496");
            member.guild.members.get(member.user.id).addRole(memberrole)
            member.guild.members.get(member.user.id).addRole(clientrole)
            client.channels.get(config2.welcome).send("Welcome back <@" + member.user.id + "> to DanBot Hosting!");
        }
        
        if(mutesData.fetch(member.user.id + ".muted") === "true") {
            let muteRole = client.guilds.get(member.guild.id).roles.find(r => r.id == "726829710935457872");
            member.guild.members.get(member.user.id).addRole(muteRole)
        }
    
        member.guild.fetchInvites().then(guildInvites => {
            const ei = invites[member.guild.id];
            invites[member.guild.id] = guildInvites;
            const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
            const inviter = client.users.get(invite.inviter.id);
            let embed = new Discord.RichEmbed()
            .setColor(`GREEN`)
            .addField(`New Members Username:`, member.user.tag, true)
            .addField(`New Members ID:`, '`' + member.user.id + '`', true)
            .addField('Account created:', member.user.createdAt.toDateString(), true)
            .addField("Members Status", member.user.presence !== null && member.user.presence.status !== null ? member.user.presence.status : "Offline")
            .addField('\u200b', '\u200b')
            .addField(`Invited by:`, inviter.tag, true)
            .addField(`Inviter's ID:`, '`' + inviter.id + '`', true)
            .addField(`Invite code used:`, '`' + invite.code + '`', true)
            .addField(`Invite used`, invite.uses + ' times', true);
            client.channels.get(config2.invitechannel).send(embed)
            const invite5 = member.guild.roles.find(role => role.id === config2.invite5);
            const invite10 = member.guild.roles.find(role => role.id === config2.invite10);
            const invite25 = member.guild.roles.find(role => role.id === config2.invite25);
            const invite50 = member.guild.roles.find(role => role.id === config2.invite50);
            const invite100 = member.guild.roles.find(role => role.id === config2.invite100);
            const invite150 = member.guild.roles.find(role => role.id === config2.invite150);
            const invite200 = member.guild.roles.find(role => role.id === config2.invite200);
            if (invite.uses == 5) return member.guild.members.get(inviter.id).addRole(invite5), client.channels.get(config2.inviterewmsg).send(`<@${inviter.id}> just hit 5 invites! Here's a role for you :)`);
            if (invite.uses == 10) return member.guild.members.get(inviter.id).removeRole(invite5), member.guild.members.get(inviter.id).addRole(invite10), client.channels.get(config2.inviterewmsg).send(`<@${inviter.id}> just hit 10 invites! Here's a role for you :)`);
            if (invite.uses == 25) return member.guild.members.get(inviter.id).removeRole(invite10), member.guild.members.get(inviter.id).addRole(invite25), client.channels.get(config2.inviterewmsg).send(`<@${inviter.id}> just hit 25 invites! Here's a role for you :)`);
            if (invite.uses == 50) return member.guild.members.get(inviter.id).removeRole(invite25), member.guild.members.get(inviter.id).addRole(invite50), client.channels.get(config2.inviterewmsg).send(`<@${inviter.id}> just hit 50 invites! Here's a role for you :)`);
            if (invite.uses == 100) return member.guild.members.get(inviter.id).removeRole(invite50), member.guild.members.get(inviter.id).addRole(invite100), client.channels.get(config2.inviterewmsg).send(`<@${inviter.id}> just hit 100 invites! Here's a role for you :)`);;
            if (invite.uses == 150) return member.guild.members.get(inviter.id).removeRole(invite100), member.guild.members.get(inviter.id).addRole(invite150), client.channels.get(config2.inviterewmsg).send(`<@${inviter.id}> just hit 150 invites! Here's a role for you :)`);;
            if (invite.uses == 200) return member.guild.members.get(inviter.id).removeRole(invite150), member.guild.members.get(inviter.id).addRole(invite200), client.channels.get(config2.inviterewmsg).send(`<@${inviter.id}> just hit 200 invites! Here's a role for you :)`);;
        });

          
    }
};