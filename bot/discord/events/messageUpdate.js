//let client = require("../../../../index.js").client;
const fetch = require('node-fetch');
module.exports = (client, message, editedMessage) => {

  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;
  if (message === editedMessage) return;
  if (message.channel.type !== 'text') return;

  const embed = new Discord.MessageEmbed()
    .setColor(0x00A2E8)
    .setThumbnail(message.author.avatarURL)
    .addField("Author ", `${message.author.tag} (ID: ${message.author.id})`)
    .addField("Before Edit ", `${message}`)
    .addField("After Edit", `${editedMessage}`)
    .setTimestamp()
    .setFooter("Message edit in " + message.channel.name);
  client.channels.cache.get(config.DiscordBot.mLogs).send({
    embed
  });
};
