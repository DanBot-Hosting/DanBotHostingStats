exports.run = async (client, message, args) => {
    if (message.channel.name.includes('-ticket')) {
        const filter2 = m => m.author.id === message.author.id;
        const warning = await message.channel.send('<@' + message.author.id + '> are you sure you want to close this ticket? Please type `confirm` to close the ticket or `cancel` to keep the ticket open.')

        let collected1 = await message.channel.createMessageCollector(filter2, {
            max: 1,
            time: 30000,
            errors: ['time'],
        })
        collected1.on('collect', m => {
            if (m.content.toLowerCase() === "confirm") {
                message.channel.send("**Closing ticket.**", null).then(setTimeout(() => {
                    message.channel.delete()
                }, 5000))
            } else if (m.content.toLowerCase() === "cancel") {
                message.channel.send('Closing ticket. __**Canceled**__ Ticket staying open.');
            }});
        collected1.on('end', collected => {
            if(!collected) {
                message.channel.send(`ERROR: User failed to provide an answer. Ticket staying open.`);
            }
        });
    } else if (!message.channel.name.includes('-ticket')) {
        message.channel.send('ERROR: You can only use this command in ticket channels.')

    }
}
