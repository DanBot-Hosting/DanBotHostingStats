exports.run = async (client, message, args) => {
    if (!args[1]) {
        message.channel.send('Usage is: `DBH!server redeem code`')
    } else {
        if(codes.get(args[1]) == null) {
            message.channel.send('That code is invalid or expired')
        } else {
            message.channel.send(`You have added ${codes.get(args[1])} premium server(s) to this account!`)
            codes.delete(args[1]);
        }
    }
}