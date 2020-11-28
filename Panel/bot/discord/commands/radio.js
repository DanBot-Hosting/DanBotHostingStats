const moment = require('moment');
const Discord = require('discord.js')
exports.run = (client, message, args, guild) => {
    if (message.author.id == "137624084572798976") {
        client.channels.get("781918160219668510").join()
        .then(connection => {
            var internetradio = require('node-internet-radio');
            var testStream = "http://62.171.128.136:8000/DanBotFM";
            internetradio.getStationInfo(testStream, function(error, station) {
                const embed = new Discord.RichEmbed()
                .setColor("GREEN")
                .addField("**Now playing**:", "DanBotFM")
                .addField('**Song now playing**:', station.title)
                message.channel.send(embed)
            });
            connection.playStream('http://62.171.128.136:8000/DanBotFM')
        });

    }
    
};