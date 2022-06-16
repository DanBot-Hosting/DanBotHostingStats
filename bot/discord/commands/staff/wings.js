exports.run = async(client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id === "898041741695926282")) return;

    if (!['137624084572798976'].includes(message.author.id)) return;
    if (!args[1]) {
        let i = 1
        while (i < 15) {
            require('axios')({
                url: "http://n" + i + ".danbot.host:999/wings?action=restart",
                method: 'GET',
                headers: {
                    "password": config.externalPassword
                },
            }).then(response => {
                if (response.data.status === "Wings restarted") {
                    message.channel.send('[WINGS] Restarted for node ' + i + '\nAllow 5 - 10mins for wings to boot.')
                } else {
                    message.channel.send(response.data.status)
                }
            })
            i++
        }
    } else {
        message.delete()
        require('axios')({
            url: "http://n" + args[1] + ".danbot.host:999/wings?action=" + args[2].toLowerCase(),
            method: 'GET',
            headers: {
                "password": config.externalPassword
            },
        }).then(response => {
            if (response.data.status === "Wings restarted") {
                message.channel.send('[WINGS] Restarted for node ' + args[1] + '\nAllow 5 - 10mins for wings to boot.')
            } else {
                message.channel.send(response.data.status)
            }
        })
    }
}
