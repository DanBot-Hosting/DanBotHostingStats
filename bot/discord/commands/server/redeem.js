const humanizeDuration = require('humanize-duration');

exports.run = async (client, message, args) => {

    let setDonations = (userid, amount) => {
        userPrem.set(userid + '.donated', amount)
    }

    if (!args[1]) {
        message.channel.send('Usage is: `DBH!server redeem code`')
    } else {
        let code = codes.get(args[1]);

        if (code == null) {
            return;
            message.channel.send('That code is invalid or expired')
        }
        let oldBal = userPrem.get(message.author.id + '.donated') || 0;

        let now = Date.now();
        message.channel.send(`You have redeemed a code with ${code.balance} premium server(s), you now have ${oldBal + code.balance}!`)
        client.channels.cache.get('795884677688721448').send('<@' + message.author.id + '>, Redeemed code: ' + args[1] + ' it held ' + code.balance + ' premium servers! *This code was redeemed in ' + humanizeDuration(now - code.createdAt) + '*')

        codes.delete(args[1]);

        message.member.roles.add('788193704014905364');
        setDonations(message.author.id, oldBal + code.balance);
    }
}