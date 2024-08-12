const Discord = require("discord.js");
const humanizeDuration = require("humanize-duration");

const Config = require('../../../config.json');
const MiscConfigs = require('../../../config/misc-configs.js');

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {
    let setDonations = (userid, amount) => {
        userPrem.set(userid + ".used", userPrem.get(userid + ".used") || 0);
        userPrem.set(userid + ".donated", amount);
    };

    if (!args[1]) {
        message.reply("Usage is: `" + Config.DiscordBot.Prefix + "server redeem code`");
    } else {
        let code = codes.get(args[1]);

        if (code == null) {
            message.reply("That code is invalid or expired");
            return;
        }
        let oldBal = userPrem.get(message.author.id + ".donated") || 0;

        let now = Date.now();
        message.reply(
            `You have redeemed a code with ${code.balance} premium server(s), you now have ${Math.floor(
                (oldBal + code.balance) / Config.PremiumServerPrice,
            )}!`,
        );
        client.channels.cache
            .get(MiscConfigs.donations)
            .send(
                "<@" +
                    message.author.id +
                    ">, Redeemed code: " +
                    args[1] +
                    " it held " +
                    code.balance +
                    " premium servers! *This code was redeemed in " +
                    humanizeDuration(now - code.createdAt) +
                    "*",
            );

        codes.delete(args[1]);

        message.member.roles.add(Config.DiscordBot.Roles.Donator);

        setDonations(message.author.id, oldBal + code.balance);

        if (code.drop != null) {
            let msg = await client.channels.cache
                .get(code.drop.message.channel)
                .messages.fetch(code.drop.message.ID);
            let embed = msg.embeds[0].setDescription(
                `**REDEEM NOW!**\nThe code is: \`${code.code}\` \n**Steps:** \n- Navigate to <#` + MiscConfigs.normalCommands + `>\n- Redeem the Premium Code: \`` + Config.DiscordBot.Prefix + `server redeem <Code>\`\n\n*Redeemed by ${message.member}*`,
            );
            msg.edit(embed);
        }
    }
};

exports.description = "Redeem a premium server code. View commands for more info.";
