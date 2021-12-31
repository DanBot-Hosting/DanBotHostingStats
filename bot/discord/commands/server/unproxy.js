const sshClient = require('ssh2').Client;

async function getNewKey(){
    const serverRes = await axios({
        url: config.proxy.url + "/api/tokens",
        method: 'POST',
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            "identity": config.proxy.email,
            "secret": config.proxy.pass
        }
    });

    return serverRes.data.token;
};

exports.run = async(client, message, args) => {
    if (!args[1]) {
        const embed = new Discord.MessageEmbed()
            .setTitle('__**How to remove a domain from a server**__ \nCommand format: ' + config.DiscordBot.Prefix + 'server unproxy domainhere')
        message.channel.send(embed)
    } else if (args[1]) {
        if (args[2] == "-db") {
            userData.set(message.author.id + '.domains', userData.get(message.author.id).domains.filter(x => x.domain != args[1].toLowerCase()));
            message.reply('Unlinked from the database')
        } else {
            if (userData.get(message.author.id).domains.find(x => x.domain === args[1].toLowerCase()) == null) {
                message.channel.send("that domain isnt linked.")
                return;
            }
            config.proxy.authKey = await getNewKey();

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
                console.log(response.data)
                //Now delete it
                axios({
                    url: config.proxy.url + "/api/nginx/proxy-hosts/" + response.data.find(element => element.domain_names[0] == args[1].toLowerCase()).id,
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
                message.reply('There has been a error. Please contact Dan or try once more, \nIf the bot says its currently linked try adding `-db` to the end of the command.')
                console.log(error)
            })
        }
    }
}
