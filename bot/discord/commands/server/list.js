const axios = require('axios')
exports.run = async(client, message, args) => {
    
    return message.channel.send("This command is disabled temporarily.");    

    const loadingMsg = await message.channel.send('Loading servers...')
    //List servers
    var arr = [];
    let userID = message.author.id
    if (message.member.roles.cache.find(r => r.id === "898041747597295667")) userID = args[1] || message.author.id; // Allow devs to lookup a users server list
        
    axios({
        url: "https://panel.danbot.host" + "/api/application/users/" + userData.get(userID).consoleID + "?include=servers",
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
        setTimeout(async() => {
            //console.log(arr.length)
            // console.log(arr)
            setTimeout(() => {
                var clean = arr.map(e => "Server Name: `" + e.attributes.name + "`, Server ID: `" + e.attributes.identifier + "`\n");
                const embed = new Discord.MessageEmbed()
                    .setDescription('You have a total of ' + arr.length + ' servers.' 
                    .addField('__**Your Servers:**__', clean)
                message.channel.send(embed).catch(e => {
                    const embed = new Discord.MessageEmbed()
                        .setDescription('Your server list is too long so here is a abstracted version!\nYou have a total of ' + arr.length + ' servers!')
                        .addField('__**Your Servers:**__', arr.map(e => "`" + e.attributes.identifier + "`"))
                    message.channel.send(embed)
                })
                loadingMsg.delete();
            }, 500)
        }, 5000)
    }).catch(err => {});
}
