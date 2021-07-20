const axios = require('axios')
exports.run = async (client, message, args) => {
    message.channel.send('Loading servers...')
    //List servers
    var arr = [];
    axios({
        url: config.Pterodactyl.hosturl + "/api/application/users/" + userData.get(message.author.id).consoleID + "?include=servers",
        method: 'GET',
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
            'Content-Type': 'application/json',
            'Accept': 'Application/vnd.pterodactyl.v1+json',
        }
    }).then(response => {
        const preoutput = response.data.attributes.relationships.servers.data
        //console.log(resources.data.meta)
        arr.push(...preoutput)
        setTimeout(async () => {
            //console.log(arr.length)
            // console.log(arr)
            setTimeout(() => {
                var clean = arr.map(e => "Server Name: `" + e.attributes.name + "`, Server ID: `" + e.attributes.identifier + "`\n")
                const embed = new Discord.MessageEmbed()
                    .addField('__**Your Servers:**__', clean)
                message.channel.send({embeds: [embed]})
                //console.log(output)
            }, 500)
        }, 5000)
    }).catch(err => {});
}