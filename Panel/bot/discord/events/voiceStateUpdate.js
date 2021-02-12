const transliterate = require('transliteration');
module.exports = async (client, oldM, newM) => {
    let guild = newM.guild;

    if (oldM.voiceChannelID === newM.voiceChannelID) return;


    if (oldM.voice.channelID != null && oldM.voice.channelID != "757660050977456238" && oldM.voice.channel.parentID === "757659750342197289") {
        if (client.pvc.get(oldM.voice.channelID) != null && client.pvc.get(oldM.voice.channelID).owner == oldM.id) {
            oldM.voice.channel.delete();
            client.pvc.delete(oldM.voice.channelID);
        }
    }

    if (newM.voice.channelID === "757660050977456238") {
        let cleanName = transliterate.slugify(newM.user.username);
        if (cleanName == '') cleanName = 'unknown';
        let vc = await guild.channels.create(`${cleanName}'s Room`, {
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
        newM.voice.setChannel(vc.id);
        client.pvc.set(vc.id, {
            channelID: vc.id,
            owner: newM.id
        })
    }
};