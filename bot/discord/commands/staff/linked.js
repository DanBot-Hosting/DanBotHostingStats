exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find((r) => r.id === "898041743566594049")) return;

    if (args[1] == null) {
        message.reply(
            "Please send a users discord ID to see if they are linked with an account on the host.",
        );
    } else {
        if (userData.get(args[1]) == null) {
            message.reply("That account is not linked with a console account.");
        } else {
            console.log(userData.fetch(args[1]));
            let embed = new Discord.MessageEmbed()
                .setColor(`GREEN`)
                .addField(`__**Username**__`, userData.fetch(args[1] + ".username"))
                .addField(`__**Email**__`, userData.fetch(args[1] + ".email"))
                .addField(`__**Discord ID**__`, userData.fetch(args[1] + ".discordID"))
                .addField(`__**Console ID**__`, userData.fetch(args[1] + ".consoleID"))
                .addField(`__**Date (YYYY/MM/DD)**__`, userData.fetch(args[1] + ".linkDate"))
                .addField(`__**Time**__`, userData.fetch(args[1] + ".linkTime"));
            await message.reply("That account is linked. Heres some data: ", embed);
        }
    }
};
