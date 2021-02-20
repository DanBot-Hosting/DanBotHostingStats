const Discord = require("discord.js")
const prefixtouse = config.prefix;

module.exports. run = async (client, message, args) => {

  const usage = new Discord.MessageEmbed()
  .setColor(0x00A2E8)
  .setTitle("Command: " + prefixtouse + "role")
  .addField("Usage", prefixtouse + "role <user/user id> <role/role id>")
  .addField("Example", prefixtouse + "role @Dan @Owner ")
  .setDescription("Description: " + "Adds/Removes the users role");


    let rMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!rMember) return message.channel.send(usage)
    
    let role = message.guild.roles.cache.find(r => r.name == args[1]) || message.guild.roles.cache.find(r => r.id == args[1]) || message.mentions.roles.first();
    if(!role) return message.channel.send(usage) 


    if(rMember.roles.cache.has(role.id)) {
      
      await rMember.roles.remove(role.id).catch(e => console.log(e.message))
      const succEmbed = new MessageEmbed()
      .setColor(`RED`)
      .setDescription(`Success ✅ | ${rMember.displayName} has been removed from **${role.name}**`)

      const embed = new Discord.MessageEmbed()
      .setColor(0x00A2E8)
      .addField("Moderator", message.author.tag, true)
      .addField("Role Removed", role.name, true)
      .addField("Removed from", rMember.displayName, true)
      .setFooter("Time used: " + message.createdAt.toDateString())
    return client.channels.cache.get(config.DiscordBot.modLogs).send({
      embed
    });
    
    } else {
        
      await rMember.roles.add(role.id).catch(e => console.log(e.message))
      const succEmbed = new MessageEmbed()
      .setColor(`RED`)
      .setDescription(`Success ✅ | ${rMember.displayName} has been added to **${role.name}**`)
      message.channel.send(succEmbed)

      const embed = new Discord.MessageEmbed()
      .setColor(0x00A2E8)
      .addField("Moderator", message.author.tag, true)
      .addField("Role Added", role.name, true)
      .addField("Added to", rMember.displayName, true)
      .setFooter("Time used: " + message.createdAt.toDateString())
    return client.channels.cache.get(config.DiscordBot.modLogs).send({
      embed
    });
    
    }

  };