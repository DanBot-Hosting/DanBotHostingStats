const ms = require('ms')
const humanizeDuration = require('humanize-duration');

exports.run = async (client, message, args) => {
    if (!['137624084572798976', '293841631583535106'].includes(message.author.id)) return;
    message.delete();

    if (args[1] == null) {
        message.reply("ayo fam, you need to specify a time.");
        return;
    }

    const CAPSNUM = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var codeGen = () => {
        var password = "";
        while (password.length < 16) {
            password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
        }
        return password;
    };

    let time = ms(args[1]) || 300000;

    let code; 

    let moment = Date.now();


    if (!args[2]) {
        let random = codeGen();

        code = codes.set(random, {
            code: random,
            createdBy: message.author.id,
            balance: 1,
            createdAt: moment + time
        })
    } else {
        code = codes.get(args[2]);
        if (code == null) {
            message.reply("That's not a code you scammer")
            return;
        }
    }


    let embed = new Discord.MessageEmbed()
        .setAuthor("Key Drop!")
        .setColor("BLUE").setFooter(`Keydrop by ${message.author.username}`, bot.user.avatarURL)
        .setDescription("Dropping a premium key in: " + humanizeDuration(time, { round: true }) + "!")
        .setTimestamp(moment + time)

    let msg = await message.channel.send({ content: '',
        embeds: [embed.setDescription("Dropping a premium key in: " + humanizeDuration(time, { round: true }) + "!")]
    });

    codes.set(code.code + ".drop", {
        message: {
            ID: msg.id,
            channel: msg.channel.id
        }
    });

    setTimeout(() => {
        msg.edit({embeds: [embed.setDescription("Dropping a premium key in: " + humanizeDuration(time - (time / 1.2), { round: true }) + "!")]});
    }, time / 1.2);

    setTimeout(() => {
        msg.edit({embeds: [embed.setDescription("Dropping a premium key in: " + humanizeDuration(time / 2, { round: true }) + "!")]});
    }, time / 2);

    setTimeout(() => {
        msg.edit({embeds: [embed.setDescription(`**REDEEM NOW!**\nThe code is: \`${code.code}\` \n**Steps:** \n- Navigate to <#738532075476615288>\n- Redeem the Premium Code: \`DBH!server redeem <Code>\`\n\n*No one has redeemed the code yet!*`)]});
    }, time);
}
