exports.run = (client, message) => {
    const args = message.content.split(' ').slice(1).join(' ');

    if (message.member.roles.find(r => r.name === "Moderators")) {
        if (args == "") {
            let embed = new Discord.RichEmbed()
                .setColor(`GREEN`)
                .addField(`__**Access a user's server**__`, '', true);
            message.channel.send(embed)

        } else {

        }
    }
};