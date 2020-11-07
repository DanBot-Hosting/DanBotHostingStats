const superagent = require("snekfetch");
exports.run = async (client, message, args) => {
    if (!args[0]) {
        superagent.get('https://api.danbot.host/dog')
            .end((err, response) => {
                const embed = new Discord.RichEmbed()
                    .addField('Dog API:', response.body.total + " images. \nhttps://api.danbot.host/dog")
                message.channel.send(embed)
            })
    } else if (args[0] == "dog") {
        superagent.get('https://api.danbot.host/dog')
            .end((err, response) => {
                message.channel.send("Random dog image from the DanBot Hosting api!", { file: `${response.body.image}` });
        });
    }
};