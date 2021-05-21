exports.run = async (client, message, args) => {
    //Yes i stole this from the createData.js
    const CAPSNUM = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var codeGen = () => {

        var password = "";
        while (password.length < 16) {
            password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
        }
        return password;
    };

    if (!['137624084572798976', '293841631583535106'].includes(message.author.id)) return;

    if (args.length < 3) {
        message.channel.send('Usage: `DBH!staff code name uses`\n\nExample: `DBH!staff code danishot 5`')
        return;
    }

    let balance = parseInt(args[2]);

    if (isNaN(balance)) {
        message.channel.send('Uses must be a valid number');
        return;
    }

    const code = args[1].toLowerCase() == "random" ? codeGen() : args[1];

    if (codes.get(code) != null) {
        message.channel.send('A code with that name already exists');
        return;
    }    

    message.channel.send('Created code: `' + code + '` with `' + args[2] + '` premium servers. \n\nRedeem this with `DBH!server redeem ' + code + '`')

    codes.set(code, {
        createdBy: message.author.id,
        balance: balance,
        createdAt: Date.now()
    });

}
