exports.run = async (client, message, args) => {
    if (!["137624084572798976", "737603315722092544", "459025800633647116", "853158265466257448"].includes(message.author.id)) return;

    if (args.length < 4) return;
    let parser = new Intl.NumberFormat();

    let setDonations = (userid, amount) => {
        userPrem.set(userid + ".donated", amount);
    };

    let sendMessage = (userid, amount) => {
        message.delete();
        message.channel.send("Thanks <@" + userid + "> for donating! \nYou can now create donator servers using `" + config.DiscordBot.Prefix + "server create-donator`");
        client.channels.cache.get("898041841939783732").send("Thanks, <@" + userid + "> for donating $" + parser.format(amount));
    };

    let userid = message.guild.members.cache.get(
        args[2].match(/[0-9]{17,19}/).length == 0 ? args[2] : args[2].match(/[0-9]{17,19}/)[0]
    );
    let amount = Number.parseInt(args[3]);
    if (isNaN(amount)) return;

    let oldBal = userPrem.get(userid + ".donated") || 0;

    if (args[1].toLowerCase() === "add") {
        setDonations(userid, amount + oldBal);
        sendMessage(userid, amount);

        await message.guild.members.cache.get(userid.id).roles.add("898041754564046869");
    }

    if (args[1].toLowerCase() === "set") {
        setDonations(userid, amount);
        sendMessage(userid, amount);

        await message.guild.members.cache.get(userid.id).roles.add("898041754564046869");
    }

    if (args[1].toLowerCase() === "remove") {
        setDonations(userid, Math.max(0, oldBal - amount));
        // sendMessage(userid, Math.max(0, oldBal - amount))
    }
};
