exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed().addField(
        "__**Commands**__",
        "`" +
            config.DiscordBot.Prefix +
            "user new` | Create an account \n`" +
            config.DiscordBot.Prefix +
            "user password` | Reset account password \n`" +
            config.DiscordBot.Prefix +
            "user link` | Link this account with console account \n`" +
            config.DiscordBot.Prefix +
            "user unlink` | Unlinks account from the console account \n`" +
            config.DiscordBot.Prefix +
            "user invites` | Shows the amount of people you have invited to this server \n`" +
            config.DiscordBot.Prefix +
            "user premium` | Check your premium server limit"
    );
    await message.reply(embed);
};
