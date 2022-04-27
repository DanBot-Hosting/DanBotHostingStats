const axios = require('axios');
exports.run = async (client, message, args) => {
    message.channel.send('Loading servers...');
    const arr = [];
    let userID = message.author.id;
    if (message.member.roles.cache.has("898041747597295667")) userID = args[1] || message.author.id;

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
        const preoutput = response.data.attributes.relationships.servers.data;
        arr.push(...preoutput);
        setTimeout(() => {
            const clean = arr.map(e => `Server Name: \`${e.attributes.name}\`, Server ID: \`${e.attributes.identifier}\`\n`);
            const embed = new Discord.MessageEmbed()
                .addField('__**Your Servers:**__', clean);
            message.channel.send(embed).catch(e => {
                const embed = new Discord.MessageEmbed()
                    .setDescription('Your server list is too long so here is an abstracted version!')
                    .addField('__**Your Servers:**__', arr.map(e => `\`${e.attributes.identifier}\``));
                message.channel.send(embed);
            });
        }, 500);
    }).catch(err => { });
};
