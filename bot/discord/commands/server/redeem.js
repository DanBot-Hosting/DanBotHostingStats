exports.run = async (client, message, args) => {
    if (!args[1]) {
        message.channel.send('Usage is: `DBH!server redeem code`')
    } else {
        if(codes.get(args[1]) == null) {
            message.channel.send('That code is invalid or expired')
        } else {
            message.channel.send(`You have added ${codes.get(args[1])} premium server(s) to this account!`)
            client.channels.cache.get('795884677688721448').send('<@' + message.author.id + '>, Redeemed code: ' + args[1] + ' it held ' + codes.get(args[1]) + ' premium servers!')
            codes.delete(args[1]);
        }
    }
}