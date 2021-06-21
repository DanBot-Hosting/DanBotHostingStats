const humanizeDuration = require('humanize-duration');

exports.run = async (client, message, args) => {
    if(message.member.roles.cache.find(r => r.id === "748117822370086932") && message.channel.id === "754441222424363088") {
    return message.channel.send('LMAO Imagine trying to be a staff member and trying to redeem a code in <#754441222424363088>')
}

    let setDonations = (userid, amount) => {
        userPrem.set(userid + '.donated', amount)
    }

    if (!args[1]) {
        message.channel.send('Usage is: `DBH!server redeem code`')
    } else {
        let code = codes.get(args[1]);

        if (code == null) {
            message.reply('That code is invalid or expired')
            return;
        }
        let oldBal = userPrem.get(message.author.id + '.donated') || 0;

        let now = Date.now();
        message.reply(`You have redeemed a code with ${code.balance} premium server(s), you now have ${oldBal + code.balance}!`)
        client.channels.cache.get('795884677688721448').send('<@' + message.author.id + '>, Redeemed code: ' + args[1] + ' it held ' + code.balance + ' premium servers! *This code was redeemed in ' + humanizeDuration(now - code.createdAt) + '*')

        codes.delete(args[1]);

        message.member.roles.add('788193704014905364');
        setDonations(message.author.id, oldBal + code.balance);

        if (code.drop != null) {
            let msg = await client.channels.cache.get(code.drop.message.channel)?.messages.fetch(code.drop.message.ID);
            let embed = msg?.embeds[0]?.setDescription(`**REDEEM NOW!**\nThe code is: \`${code.code}\` \n**Steps:** \n- Navigate to <#738532075476615288>\n- Redeem the Premium Code: \`DBH!server redeem <Code>\`\n\n*Redeemed by ${message.member}*`)
            msg.edit(embed)
        }
    }
}
