const Discord = require("discord.js");
/*
exports.run = async(client, message, args) => {


    let embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle("DanBot Hosting - Ping")
        .setDescription('Pings on this command are done to `1.1.1.1`')
        .addField(`Canada's Ping Server \nPing: ${ping(config.Ping.CA)}`, `Uptime: ${uptime(config.Ping.CA)}`)
        .addField(`UK's Ping Server \nPing: ${ping(config.Ping.UK)}`, `Uptime: ${uptime(config.Ping.UK)}`)
        .setTimestamp()
    await message.channel.send(embed)

};

const ping = function(location) {
    axios({
        url: "http://" + location + `?ip=1.1.1.1&port=22`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        console.log(response.data)
        return response.data.ping
    })
}

const uptime = function(location) {
    axios({
        url: "http://" + location + `/uptime`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        return response.data
    })
}
*/
