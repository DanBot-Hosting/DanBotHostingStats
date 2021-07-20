let db = require("quick.db");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {
       let key = `danbot-${randomstring.generate(7)}`

    let keyPool = db.get("apiKeys");
    if (!keyPool) keyPool = [];

    if (!args[0]) {

        if(db.fetch(`${message.author.id}_apikey`)) {
            return message.channel.send(`🚧 | You already have an API key. You can delete it by typing: **DBH!apikey delete**!`)
        }

        let msg = await message.channel.send(`💡 | Im getting your **API Key**...`)

        try {

            let embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} | Api Key`, client.user.avatarURL())
            .setDescription(`> Do not share this key with anyone else!`)
            .addField(`🔑 | Key:`, `> \`${key}\``)
            .addField(`❓ | Info`, `> How to Post stats? [Visit This Site](https://www.npmjs.com/package/danbot-hosting)\n> Package Github: [Click Here](https://github.com/danbot-devs/danbot-hosting)`)
            .setColor(message.guild.me.displayHexColor)
            .setTimestamp()
            await message.author.send(embed)
            msg.edit(`🔑 | Check your **DM's** for your **API Key**.`).catch((err) => { message.channel.send(`🔑 | Check your **DM's** for your **API Key**.`)})

        } catch(err) {
            return message.channel.send(`**An error occupied:**\n\`\`\`js\n${err}\`\`\``)
        }

        db.push("apiKeys", key);
        db.set(`${message.author.id}_apikey`, key);
        db.set(`${key}`, message.author.id)
        return;
        
    }

    if (args[0] === "delete") {

        if(!db.fetch(`${message.author.id}_apikey`)) {
            return message.channel.send(`🚧 | You **dont** have an **API key** to delete.`)
        }

        let msg = await message.channel.send(`💡 | Im deleting your **API Key**...`);

        let token = db.get(`${message.author.id}_apikey`);

        let keys = db.get("apiKeys");
          var filtered = keys.filter(function (el) { return el != `${token}`});

        db.set("apiKeys", filtered);
        db.delete(`${message.author.id}_apikey`);
        db.delete(`${token}`)
        return msg.edit(`💡 | Your **API Key** has been deleted.`).catch((err) => { message.channel.send(`💡 | Your **API Key** has been deleted.`)})
    }
};
