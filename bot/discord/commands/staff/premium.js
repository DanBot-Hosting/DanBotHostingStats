exports.run = async(client, message, args) => {
    if (!['137624084572798976'].includes(message.author.id)) return;

    if (args.length < 4) return;
    let parser = new Intl.NumberFormat();

    let setDonations = (userid, amount) => {
        userPrem.set(userid + '.donated', amount)
    }

    let sendMessage = (userid, amount) => {
        message.delete()
        message.channel.send('Thanks <@' + userid + '> for donating! \nYou can now create donator servers using `' + config.DiscordBot.Prefix + 'server create-donator`')
        client.channels.cache.get('795884677688721448').send('Thanks, <@' + userid + '> for donating ' + parser.format(amount) + '$!')
    }

    let userid = message.guild.members.cache.get(args[2].match(/[0-9]{18}/).length == 0 ? args[2] : args[2].match(/[0-9]{18}/)[0]);
    let amount = Number.parseInt(args[3])
    if (isNaN(amount)) return;

    let oldBal = userPrem.get(userid + '.donated') || 0

    if (args[1].toLowerCase() === 'add') {
        setDonations(userid, amount + oldBal);
        sendMessage(userid, amount)
        message.member.roles.add('788193704014905364');
    }


    if (args[1].toLowerCase() === 'set') {
        setDonations(userid, amount);
        sendMessage(userid, amount)
        message.member.roles.add('788193704014905364');
    }

    if (args[1].toLowerCase() === 'remove') {
        setDonations(userid, Math.max(0, oldBal - amount));
        // sendMessage(userid, Math.max(0, oldBal - amount))
    }
}
