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

    if (args.length < 4) return message.reply("You didn't provide enough arguements.");

    let parser = new Intl.NumberFormat();

    let setDonations = async (userid, amount) => {

        if (await userPrem.get(userid + ".used") == null) {
            await userPrem.set(userid + ".used", 0);
        }

        await userPrem.set(userid + ".donated", amount);
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

    let userid = args[2].match(/[0-9]{17,19}/) ? args[2].match(/[0-9]{17,19}/)[0] : args[2];

    let amount = Number.parseInt(args[3]);
    if (isNaN(amount)) return;

    let userPremium = await userPrem.get(userid);
    let oldBal = userPremium ? userPremium.donated || 0 : 0;

    if (args[1].toLowerCase() === "add") {
        await setDonations(userid, amount + oldBal);
        sendMessage(userid, amount);


        const user = await client.users.fetch(userid);
        const member = await message.guild.members.fetch(userid);
        await member.roles.add(Config.DiscordBot.Roles.Donator);

    }

    if (args[1].toLowerCase() === "set") {
        await setDonations(userid, amount);
        sendMessage(userid, amount);

        const user = await client.users.fetch(userid);
        const member = await message.guild.members.fetch(userid);
        await member.roles.add(Config.DiscordBot.Roles.Donator);
    }

    if (args[1].toLowerCase() === "remove") {
        await setDonations(userid, Math.max(0, oldBal - amount));
    }
};
