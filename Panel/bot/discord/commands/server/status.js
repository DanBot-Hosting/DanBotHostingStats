const axios = require('axios');
exports.run = async (client, message, args, cooldown) => {
    if (!args[1]) {
        let embed = new Discord.MessageEmbed()
            .setColor(`GREEN`)
            .addField(`__**Server Status**__`, 'What server would you like to view? Please type: `' + config.DiscordBot.Prefix + 'server status serverid`', true)
        message.channel.send(embed)
    } else {
        message.channel.send('Fetching server...')
        axios({
            url: config.Pterodactyl.hosturl + "/api/client/servers/" + args[1],
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.Pterodactyl.apikeyclient,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response => {
            axios({
                url: config.Pterodactyl.hosturl + "/api/client/servers/" + args[1] + "/resources",
                method: 'GET',
                followRedirect: true,
                maxRedirects: 5,
                headers: {
                    'Authorization': 'Bearer ' + config.Pterodactyl.apikeyclient,
                    'Content-Type': 'application/json',
                    'Accept': 'Application/vnd.pterodactyl.v1+json',
                }
            }).then(resources => {
                let embedstatus = new Discord.MessageEmbed()
                    .setColor('GREEN')
                    .addField('**Status**', resources.data.attributes.current_state, true)
                    .addField('**CPU Usage**', resources.data.attributes.resources.cpu_absolute + '%')
                    .addField('**RAM Usage**', pretty(resources.data.attributes.resources.memory_bytes) + '  out of UNLIMITED MB')
                    .addField('**DISK Usage**', pretty(resources.data.attributes.resources.disk_bytes) + '  out of UNLIMITED MB')
                    .addField('**NET Usage**', 'UPLOADED: ' + pretty(resources.data.attributes.resources.network_tx_bytes) + ', DOWNLOADED: ' + pretty(resources.data.attributes.resources.network_rx_bytes))
                    .addField('**NODE**', response.data.attributes.node)
                    .addField('**FULL ID**', response.data.attributes.uuid)
                    .addField('\u200b', '\u200b')
                    .addField('**LIMITS (0 = unlimited)**', 'MEMORY: ' + response.data.attributes.limits.memory + 'MB \nDISK: ' + response.data.attributes.limits.disk + 'MB \nCPU: ' + response.data.attributes.limits.cpu)
                    .addField('**MISC LIMITS**', 'DATABASES: ' + response.data.attributes.feature_limits.databases + '\nBACKUPS: ' + response.data.attributes.feature_limits.backups)
                message.reply(embedstatus)
            })
        }).catch(error => {
            message.channel.send('Server not found')
        });
    }
}