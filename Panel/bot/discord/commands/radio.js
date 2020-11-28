const moment = require('moment');
const Discord = require('discord.js')
exports.run = (client, message, args, guild) => {
    if (message.author.id == "137624084572798976") {
        client.channels.get("781918160219668510").join()
        .then(connection => {
            connection.playStream('http://62.171.128.136:8000/DanBotFM')
        });

    }
    
};