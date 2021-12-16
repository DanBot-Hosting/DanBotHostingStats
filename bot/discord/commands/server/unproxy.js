const sshClient = require('ssh2').Client;
exports.run = async(client, message, args) => {
    if (!args[1]) {
        const embed = new Discord.MessageEmbed()
            .setTitle('__**How to remove a domain from a server**__ \nCommand format: ' + config.DiscordBot.Prefix + 'server unproxy domainhere')
        message.channel.send(embed)
    } else if (args[2]) {

        if (userData.get(message.author.id).domains.find(x => x.domain === args[1].toLowerCase()) == null) {
            message.channel.send("that domain isnt linked.")
            return;
        }

        axios({
            url: config.proxy.url + "/api/nginx/proxy-hosts",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': config.proxy.authKey,
                'Content-Type': 'application/json',
            }
        }).then(response => {
            //Now delete it
            axios({
                url: config.proxy.url + "/api/nginx/proxy-hosts/" + ResponseAfterProxy.data.find(element => element.domain_names[0] == args[1].toLowerCase()).id,
                method: 'DELETE',
                followRedirect: true,
                maxRedirects: 5,
                headers: {
                    'Authorization': config.proxy.authKey,
                    'Content-Type': 'application/json',
                }
            }).then(response => {
                userData.set(message.author.id + '.domains', userData.get(message.author.id).domains.filter(x => x.domain != args[1].toLowerCase()));
                message.reply('Domain has been unproxied')
            })
        }).catch(error => {
            message.reply('There has been a error. Please contact Dan or try once more')
        })

    }
}
