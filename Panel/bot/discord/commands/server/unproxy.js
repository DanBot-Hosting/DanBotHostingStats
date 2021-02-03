const sshClient = require('ssh2').Client;
exports.run = async (client, message, args, cooldown) => {
    if (!args[1]) {
        const embed = new Discord.MessageEmbed()
            .setTitle('__**How to remove a domain from a server**__ \nCommand format: ' + config.DiscordBot.Prefix + 'server unproxy domainhere')
        message.channel.send(embed)
    } else {

        if (userData.get(message.author.id).domains.find(x => x.domain === args[1].toLowerCase()) == null) {
            message.channel.send("that domain isnt linked.")
            return;
        }

        //SSH Connection
        ssh.connect({
            host: config.SSH.Host,
            username: config.SSH.User,
            port: config.SSH.Port,
            password: config.SSH.Password,
            tryKeyboard: true,
        })

        //Delete file from apache2 dir
        ssh.execCommand('a2dissite ' + args[1] + ' && rm /etc/apache2/sites-available/' + args[1] + '.conf && rm -rf /etc/letsencrypt/live/' + args[1] + ' && rm -rf /etc/letsencrypt/archive' + args[1] + '&& service apache2 restart', {
            cwd: '/root'
        })
        fs.unlinkSync("./proxy/" + args[1] + ".conf");

        userData.set(message.author.id + '.domains', userData.get(message.author.id).domains.filter(x => x.domain != args[1].toLowerCase()));

        message.channel.send('Proxy has been removed from ' + args[1])
    }
}