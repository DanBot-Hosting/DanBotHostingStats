exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id === "639489438036000769")) return;

    const dan = new Discord.MessageEmbed()
        .setTitle('Dan\/s Special Command \n`' +
        'DAN IS THE BEST! DAN IS THE BEST! DAN IS THE BEST! DAN IS THE BEST! DAN IS THE BEST! DAN IS THE BEST! (Solo is good too)\nDan is Our God and Savior')

    await message.channel.send(dan)
}
