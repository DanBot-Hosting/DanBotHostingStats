const transliterate = require('transliteration');
module.exports = async (client, oldV, newV) => {
    let guild = newV.guild;

    if (oldV.channelID === newV.channelID || enabled.customVoiceChannels == false) return;


    if (oldV.channelID != null && oldV.channelID != "898041899854737431" && oldV.channel.parentID === "898041808242741268") {
        if (client.pvc.get(oldV.channelID) != null && client.pvc.get(oldV.channelID).owner == oldV.member.id) {
            oldV.channel.delete();
            client.pvc.delete(oldV.channelID);
        }
    }

    if (newV.channelID === "898041899854737431") {
        let cleanName = transliterate.slugify(newV.member.user.username);
        if (cleanName == '') cleanName = 'unknown';
        let vc = await guild.channels.create(`${cleanName}'s Room`, {
            type: "voice",
        })
        vc.setParent("898041808242741268");
        vc.overwritePermissions([{
            id: guild.id,
            deny: ["CONNECT", "VIEW_CHANNEL"]
        }, {
            id: newV.member.id,
            allow: ["SPEAK", "STREAM", "CONNECT", "VIEW_CHANNEL"]
        }])
        newV.setChannel(vc.id);
        client.pvc.set(vc.id, {
            channelID: vc.id,
            owner: newV.member.id
        })
    }
};
