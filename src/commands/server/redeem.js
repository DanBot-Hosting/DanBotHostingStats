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
        message.reply("Użycie: `" + Config.DiscordBot.Prefix + "server redeem code`");
    } else {
        let code = codes.get(args[1]);

        if (code == null) {
            message.reply("Ten kod jest nieważny lub wygasł");
            return;
        }
        let oldBal = userPrem.get(message.author.id + ".donated") || 0;

        let now = Date.now();
        message.reply(
            `Odebrałeś kod z ${code.balance} premium serwerami, teraz masz ${Math.floor(
                (oldBal + code.balance) / Config.PremiumServerPrice,
            )}!`,
        );
        client.channels.cache
            .get(MiscConfigs.donations)
            .send(
                "<@" +
                message.author.id +
                ">, Odebrano kod: " +
                args[1] +
                " miał " +
                code.balance +
                " premium serwerów! *Ten kod został odebrany w " +
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
                `**ODEBRAJ TERAZ!**\nKod to: \`${code.code}\` \n**Kroki:** \n- Przejdź do <#` + MiscConfigs.normalCommands + `>\n- Odebranie Premium Kodu: \`` + Config.DiscordBot.Prefix + `server redeem <Kod>\`\n\n*Odebrał ${message.member}*`,
            );
            msg.edit(embed);
        }
    }
};

exports.description = "Odbierz kod premium serwera. Sprawdź komendy, aby uzyskać więcej informacji.";