exports.run = async (client, message, args) => {
    if (message.channel.name.includes('-ticket')) {
        const filter2 = m => m.author.id === message.author.id;
        const warning = await message.channel.send('<@' + message.author.id + '> are you sure you want to close this ticket? please type `confirm` to close the ticket or `cancel` to keep the ticket open.')

        let collected1 = await message.channel.createMessageCollector(filter2, {
            max: 1,
            time: 30000,
            errors: ['time'],
        })
        collected1.on('collect', m => {
            if (m.content.toLowerCase() === "confirm") {
                message.channel.send("**Closing ticket.**", null).then(setTimeout(() => {
                    message.channel.delete()
                    const { create } = require("sourcebin");
                    message.channel.messages.fetch().then(async (messages) => {
                        const script = messages.array().reverse().map(m => `${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join('\n')
    
                        create([
                    {
                        content: script,
                        language: "text",
                    },
                    ]).then(bin=> {
                    const Discord = require('discord.js') 
                        const channel = client.channels.cache.get('channel id UwU') //OwO You need a channel ID I suggest making a new one :)
                        const embed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setTitle(`A Ticket Has Been Closed`)
                        .setDescription(`User: <@!${message.author.id}>\n\n Ticket Name: **${message.channel.name}**`)
                        .setFooter(message.author.id)
                        .setTimestamp()
                        channel.send(`Transcript: ${bin.url}`, embed)
                })
            })
                }, 5000))
            } else if (m.content.toLowerCase() === "cancel") {
                message.channel.send('Closing ticket. __**Canceled**__ Ticket staying open.');
            }
        });
        collected1.on('end', collected => {
            if (!collected) {
                message.channel.send(`ERROR: User failed to provide an answer. Ticket staying open.`);
            }
        });
    } else if (!message.channel.name.includes('-ticket')) {
        message.channel.send('ERROR: You can only use this command in ticket channels.')

    }
}
