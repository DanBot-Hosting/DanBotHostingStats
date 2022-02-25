const superagent = require("snekfetch");
exports.run = async(client, message, args) => {
    if (!args[0]) {
        axios.get('https://api.danbot.host/')
            .then((err, response) => {
                const embed = new Discord.MessageEmbed()
                    .addField('Dog API:', response.body.dogtotal + " images. \nhttps://api.danbot.host/dog", true)
                    .addField('Cat API:', response.body.cattotal + " images. \nhttps://api.danbot.host/cat", true)
                    .setFooter('You can get a image from the api using DBH!animalapi animalhere')
                message.channel.send(embed)
            })
    } else if (args[0] === "dog") {
        axios.get('https://api.danbot.host/dog')
            .then((response) => {
                console.log(response)
                message.channel.send("Random dog image from the DanBot Hosting api!", {
                    file: response.data.image
                });
            });
    }
};
