const Discord = require("discord.js")
const prefixtouse = config.prefix;
module.exports.run = (client, message, args) => {
  
  const usage = new Discord.MessageEmbed()
  .setColor(0x00A2E8)
  .setTitle("Command: " + prefixtouse + "slowmode")
  .addField("Usage", prefixtouse + "slowmode <amount>")
  .addField("Example", prefixtouse + "slowmode 20 ")
  .setDescription("Description: " + "Sets the channel slowmode");

    if (!args[0])
      return message.channel.send(
       usage
      );
      
    if (isNaN(args[0])) return message.channel.send(`That is not a number!`);
    
    message.channel.setRateLimitPerUser(args[0]);
    message.channel.send(
      `Done | Slowmode set to: \`${args[0]}\``
    );

    const embed = new Discord.MessageEmbed()
    .setColor(0x00A2E8)
    .addField("Moderator", message.author.tag, true)
    .addField("Slowmode Amount", args[0])
    .addField("In channel", message.channel.name, true)
    .setFooter("Time used: " + message.createdAt.toDateString())
  return client.channels.cache.get(config.DiscordBot.modLogs).send({
    embed
  });
  
};