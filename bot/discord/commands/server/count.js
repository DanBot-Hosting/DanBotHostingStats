const axios = require('axios')
exports.run = async(client, message, args) => {
    message.channel.send('Loading servers...')
    //List servers
    var arr = [];
    let userid = args[1] == null ? (message.author.id) : (args[1].match(/[0-9]{18}/).length == 0 ? args[1] : args[1].match(/[0-9]{18}/)[0]);
    let user = userPrem.fetch(userid);
    if (user == null) user = {}
    // let userID = message.author.id
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
                // var clean = arr.map(e => "Server Name: `" + e.attributes.name + "`, Server ID: `" + e.attributes.identifier + "`\n");
                const embed = new Discord.MessageEmbed()
                            //.addField('**Your Servers:**__', clean)
			    .setDescription(`Server used: ${arr.length}`);
                if(user.used) {
			embed.addField(`Premium Servers`, `You currently have ${(user.used || 0)} Premium servers.`)
			embed.addField(`Free Servers`, `You currently have ${(are.length) - (user.used || 0)} Free servers.`)
		}
                message.channel.send(embed)
                //console.log(output)
            }, 500)
        }, 5000)
    }).catch(err => {});
}
