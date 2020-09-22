const axios = require('axios');
exports.run = (client, message) => {
    const args = message.content.split(' ').slice(1).join(' ');

    if (args == "") {
        let embed = new Discord.RichEmbed()
            .setColor(`GREEN`)
            .addField(`__**Server Status**__`, 'What server would you like to view? Please type: ' + config.DiscordBot.Prefix + 'status serveridhere', true)
        message.channel.send(embed)

    } else {
        message.delete();

        //Send Request
        axios({
            url: config.Pterodactyl.hosturl + "/api/application/users",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response => {
            const data = response.attributes;

            DanBotHostingClient.getServerStatus(args).then((status) => {
                DanBotHostingClient.getCPUUsage(args).then(CPUUsageResponse => {
                    DanBotHostingClient.getRAMUsage(args).then(RAMUsageResponse => {
                        DanBotHostingClient.getDiskUsage(args).then(DISKUsageResponse => {
                            DanBotHostingClient.getServerInfo(args).then(InfoResponse => {
                                if (status == "on") {
                                    if (RAMUsageResponse.limit == "0") {
                                        let embedstatus = new Discord.RichEmbed()
                                            .setColor('GREEN')
                                            .addField('**Server name**', data.name)
                                            .addField('**Status**', `Online :)`, true)
                                            .addField('**CPU Usage**', CPUUsageResponse.current + ' %')
                                            .addField('**RAM Usage**', RAMUsageResponse.current + ' MB out of UNLIMITED MB')
                                            .addField('**DISK Usage**', DISKUsageResponse.current + ' MB out of ' + DISKUsageResponse.limit + ' MB')
                                            .addField('**LIMITS (0 = unlimited)**', 'Memory: ' + InfoResponse.attributes.limits.memory + ' MB, Disk: ' + InfoResponse.attributes.limits.disk + ' MB, CPU Cores: ' + InfoResponse.attributes.limits.cpu)
                                        message.reply(embedstatus)
                                    } else {
                                        let embedstatus = new Discord.RichEmbed()
                                            .setColor('GREEN')
                                            .addField('**Server name**', InfoResponse.attributes.name)
                                            .addField('**Status**', `Online :)`, true)
                                            .addField('**CPU Usage**', CPUUsageResponse.current + ' %')
                                            .addField('**RAM Usage**', RAMUsageResponse.current + ' MB out of ' + RAMUsageResponse.limit + ' MB')
                                            .addField('**DISK Usage**', DISKUsageResponse.current + ' MB out of ' + DISKUsageResponse.limit + ' MB')
                                            .addField('**LIMITS (0 = unlimited)**', 'Memory: ' + InfoResponse.attributes.limits.memory + ' MB, Disk: ' + InfoResponse.attributes.limits.disk + ' MB, CPU Cores: ' + InfoResponse.attributes.limits.cpu)
                                        message.reply(embedstatus)
                                    }
                                } else if (status == "off") {
                                    let embedstatus = new Discord.RichEmbed()
                                        .setColor('RED')
                                        .addField('**Server name**', InfoResponse.attributes.name)
                                        .addField('**Status**', `Offline :(`)
                                    message.reply(embedstatus)
                                }
                            }).catch((error) => {
                                console.log(error);
                            })
                        })
                    })
                })
            });
        });
    };
};