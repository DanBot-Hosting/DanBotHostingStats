const transliterate = require('transliteration');
module.exports = async (newM, oldM) => {
    let guild = newM.guild;
    try {
        guild.channels.get('757029522682937354').send((oldM == newM ? `${oldM.displayName}: ${oldM.voiceChannelID} = ${newM.voiceChannelID}` : `${oldM.displayName}: ${oldM.voiceChannelID} -> ${newM.voiceChannelID}`))
    } catch (error) {
        guild.channels.get('757029522682937354').send(error.name)
    }
    if (oldM.voiceChannelID == newM.voiceChannelID) return;


    if (oldM.voiceChannel != null && oldM.voiceChannelID != "757660050977456238" && oldM.voiceChannel.parentID == "757659750342197289") {
        if (client.pvc.get(oldM.voiceChannelID) != null && client.pvc.get(oldM.voiceChannelID).owner == oldM.id) {
            console.log("delete")

            oldM.voiceChannel.delete();
            client.pvc.delete(oldM.voiceChannelID);
        }
    }

    if (newM.voiceChannelID == "757660050977456238") {
        console.log("create")
        let cleanName = transliterate.slugify(newM.user.username);
        if (cleanName == '') cleanName = 'unknown';
        let vc = await guild.createChannel(`${cleanName}'s Room`, {
            type: "voice",
            permissionOverwrites: [{
                id: guild.id,
                deny: ["CONNECT", "VIEW_CHANNEL"]
            }, {
                id: newM.id,
                allow: ["SPEAK", "STREAM", "CONNECT", "VIEW_CHANNEL"]
            }]
        })
        vc.setParent("757659750342197289");
        newM.setVoiceChannel(vc.id);
        client.pvc.set(vc.id, {
            channelID: vc.id,
            owner: newM.id
        })
    }
};