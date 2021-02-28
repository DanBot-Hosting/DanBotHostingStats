const transliterate = require('transliteration');
module.exports = async (client, oldV, newV) => {
    let guild = newV.guild;

    if (oldV.channelID === newV.channelID || enabled.customVoiceChannels == false) return;


    if (oldV.channelID != null && oldV.channelID != "757660050977456238" && oldV.channel.parentID === "757659750342197289") {
        if (client.pvc.get(oldV.channelID) != null && client.pvc.get(oldV.channelID).owner == oldV.member.id) {
            oldV.channel.delete();
            client.pvc.delete(oldV.channelID);
        }
    }

    if (newV.channelID === "757660050977456238") {
        let cleanName = transliterate.slugify(newV.member.user.username);
        if (cleanName == '') cleanName = 'unknown';
        let vc = await guild.channels.create(`${cleanName}'s Room`, {
            type: "voice",
        })

        vc.overwritePermissions([{
            id: guild.id,
            deny: ["CONNECT", "VIEW_CHANNEL"]
        }, {
            id: newV.member.id,
            allow: ["SPEAK", "STREAM", "CONNECT", "VIEW_CHANNEL"]
        }])

        vc.setParent("757659750342197289");
        newV.setChannel(vc.id);
        client.pvc.set(vc.id, {
            channelID: vc.id,
            owner: newV.member.id
        })
    }
};