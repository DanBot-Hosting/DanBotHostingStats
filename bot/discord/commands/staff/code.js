exports.run = async (client, message, args) => {
    if (!['137624084572798976', '293841631583535106'].includes(message.author.id)) return;

    if (args.length < 3) {
        message.channel.send('Usage: `DBH!staff code name uses')
        return;
    }

    let balance = parseInt(args[2]);

    if (isNaN(balance)) {
        message.channel.send('Uses must be a valid number');
        return;
    }

    if (codes.get(args[1]) != null) {
        message.channel.send('A code with that name already exists');
        return;
    }

    message.channel.send('Created code: `' + args[1] + '` with `' + args[2] + '` premium servers. \n\nRedeem this with `DBH!server redeem ' + args[1] + '`')

    codes.set(args[1], {
        createdBy: message.author.id,
        balance: balance,
        createdAt: Date.now()
    });
}