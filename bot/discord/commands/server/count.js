const axios = require('axios');
exports.run = async (client, message, args) => {
    message.channel.send('Loading servers...');
    //List servers
    var arr = [];
    let userid = args[1].match(/[0-9]{18}/)?.[0] || message.author.id;
    let user = userPrem.fetch(userid);
    if (!user) user = {};

    axios({
        url: "https://panel.danbot.host" + "/api/application/users/" + userData.get(userid).consoleID + "?include=servers",
        method: 'GET',
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
            'Content-Type': 'application/json',
            'Accept': 'Application/vnd.pterodactyl.v1+json',
        }
    }).then(response => {
        const preoutput = response.data.attributes.relationships.servers.data;
        //console.log(resources.data.meta)
        arr.push(...preoutput);
        //console.log(arr.length)
        // console.log(arr)
        setTimeout(() => {
            const embed = new Discord.MessageEmbed()
                .setDescription([
                    `> Total servers: \`${arr.length}\``,
                    `- \`${arr.length - (user.used || 0)}\` are **Free servers**`,
                    `- \`${user.used || 0}\` are **Premium servers**`,
                ].join("\n"));
            message.channel.send(embed);
        }, 1000);
    }).catch(() => { });
};
