const axios = require('axios');
const {
    response
} = require('express');
exports.run = async (client, message, args) => {
    message.channel.send('Command has been renamed to `' + config.DiscordBot.Prefix + "server create`")

};