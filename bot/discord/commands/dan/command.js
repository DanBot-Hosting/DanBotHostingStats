exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id === "639489438036000769")) return;

    const dan = new Discord.MessageEmbed()
        .setTitle('Dan\/s Special Command \n`' +
        'DAN IS THE BEST! DAN IS THE BEST! DAN IS THE BEST! DAN IS THE BEST! DAN IS THE BEST! DAN IS THE BEST!\nDan is Our God and Savior\nWith out him, we would never have this amazing Hosting Website/Panel!')

    await message.channel.send(dan)
}
