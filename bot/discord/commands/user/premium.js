let parser = new Intl.NumberFormat();
exports.run = async(client, message, args) => {

    let userid = args[1] == null ? (message.author.id) : (args[1].match(/[0-9]{18}/).length == 0 ? args[1] : args[1].match(/[0-9]{18}/)[0]);


    let user = userPrem.fetch(userid);
    if (user == null) user = {}

    let allowed = Math.floor((user.donated || 0) / config.node7.price);


    const embed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .addField('Premium servers used:', (user.used || 0) + " out of  " + parser.format(allowed) + " servers used");

    await message.channel.send(embed)
}
