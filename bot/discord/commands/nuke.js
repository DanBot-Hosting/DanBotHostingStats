const Discord = require("discord.js")


module.exports.run = async(client, message, args) => {

      
      channel.clone().then((channel2) => {
        channel2.setPosition(posisi)
        channel.delete()
        channel2.send("Channel Has been nuked !",{
        files: ['https://media.tenor.com/images/0754697c9c4dd44ca8504dbf1b36b927/tenor.gif']
        });

        let channel = client.channels.cache.get(message.channel.id)
        var posisi = channel.position;
        const embed = new Discord.MessageEmbed()
        .setColor(0x00A2E8)
        .addField("Command", `Nuke`, true)
        .addField("Moderator", message.author.tag, true)
        .addField("Channel Name", channel.name, true)
        .setFooter("Time used: " + message.createdAt.toDateString())
      return client.channels.cache.get(config.DiscordBot.modLogs).send({
        embed
      });

      })
  }
