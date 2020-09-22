var getRepoInfo = require('git-repo-info');
exports.run = async (client, message) => {
    var info = getRepoInfo();

    let embed = new Discord.RichEmbed()
        .setColor(`BLUE`)
        .addField(`__**Latest GitHub push:**__`, info.committerDate)
        .addField(`__**Latest GitHub commit message:**__`, info.commitMessage)
        .addField(`__**Latest GitHub committer:**__`, info.committer)
    message.channel.send(embed)
};