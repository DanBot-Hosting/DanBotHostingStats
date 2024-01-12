// QnA command to have premade messages for the most common member questions
exports.run = async (client, message, args) => {
    let helpEmbed = new Discord.MessageEmbed()
        .setColor("RED")
        .setDescription(`You need to provide a valid tag.`)
        .setFooter("Example: DBH!qa npm");

    if (!args[1]) {
        await message.reply(helpEmbed);
        return;
    }

    const embed = new Discord.MessageEmbed();
    switch (args[1].toLowerCase()) {
        case "command":
        case "commands":
            embed.setDescription(
                "Hey! Please only run your commands in <#898041850890440725> or <#898041866589700128>"
            );
            break;
        case "504":
            embed.setDescription(
                "`Error 504` means that the wings are currently down. This is nothing you can change.\nPlease be patient and wait for Dan to fix it."
            );
            break;
        case "api":
        case "dbh-api":
            embed.setDescription(
                "You can find API-Wrappers and there documentation here:\n[Python](https://pypi.org/project/danbot-hosting/)\nSupport for more languages is comming soon."
            );
            break;
        
        default:
            return message.reply(helpEmbed.setDescription("**I could not find this tag.**"));
    }
    embed.setFooter(`Requested by ${message.author.tag}`)
    message.delete()
    return message.channel.send(embed);
};
