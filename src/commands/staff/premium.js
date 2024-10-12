const Discord = require("discord.js");
const Config = require('../../../config.json');
const MiscConfigs = require('../../../config/misc-configs.js');

exports.description = "Add Premium servers to a user.";

/**
 * 
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {
    if (
        !MiscConfigs.staffPremium.includes(message.author.id)
    )
        return;
    

    if (args.length < 4) return message.reply("You didn't provide enough arguments.");

    let userid = message.guild.members.cache.get(
        args[2].match(/[0-9]{17,19}/).length == 0 ? args[2] : args[2].match(/[0-9]{17,19}/)[0],
    );

    let parser = new Intl.NumberFormat();

    const userPremium = userPrem.get(userid);

    if(userPremium === null) {
        userPrem.set(userid, {
            donated: 0,
            used: 0
        });
    };

    let setDonations = (userid, amount) => {
        userPrem.set(userid + ".donated", amount);
    };

    let sendMessage = async (userid, amount) => {
        message.delete();
        message.channel.send(
            "Thanks <@" +
                userid +
                "> for donating! \nYou can now create donator servers using `" +
                Config.DiscordBot.Prefix +
                "server create-donator`",
        );
        client.channels.cache
            .get(MiscConfigs.donations)
            .send("Thanks, <@" + userid + "> for donating $" + parser.format(amount));
    };

    let amount = Number.parseInt(args[3]);
    if (isNaN(amount)) return;

    let oldBal = userPrem.get(userid + ".donated") || 0;

    if (args[1].toLowerCase() === "add") {
        setDonations(userid, amount + oldBal);
        sendMessage(userid, amount);

        await message.guild.members.cache.get(userid.id).roles.add(Config.DiscordBot.Roles.Donator);
    }

    if (args[1].toLowerCase() === "set") {
        setDonations(userid, amount);
        sendMessage(userid, amount);

        await message.guild.members.cache.get(userid.id).roles.add(Config.DiscordBot.Roles.Donator);
    }

    if (args[1].toLowerCase() === "remove") {
        setDonations(userid, Math.max(0, oldBal - amount));
    }
};