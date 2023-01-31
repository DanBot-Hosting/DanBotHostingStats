const axios = require("axios")

exports.run = async(client, message, args) => {
    if (message.member.roles.cache.find(r => r.id === "710208090741539006" || r.id === "898041754564046869")) {
        if (!args[0]) {
            message.channel.send('You can whitelist your name on our private minecraft servers by using `' + config.DiscordBot.Prefix + 'minecraft usernamehere`')
        } else {
            axios({
                url: "https://game.danbot.host/api/client/servers/dbedde03/command",
                method: 'POST',
                followRedirect: true,
                maxRedirects: 5,
                headers: {
                    'Authorization': 'Bearer ' + config.GamePterodactyl.apikeyclient,
                    'Content-Type': 'application/json',
                    'Accept': 'Application/vnd.pterodactyl.v1+json',
                },
                data: {
                    "command": "whitelist add " + args[0]
                }
            }).then(response => {
                message.channel.send('Done! You are now whitelisted')
            }).catch(error => {
                if (error == "Error: Request failed with status code 502") {
                    const embed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .addField(`__**Failed to whitelist you**__`, `Please ping Dan to fix this, or try again soon`)
                    message.reply(embed)
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .addField(`__**Failed to whitelist you**__`, error)
                    message.reply(embed)
                }
            })
        }
    } else {
        message.channel.send('You are not a donator or booster :(')
    }
}
