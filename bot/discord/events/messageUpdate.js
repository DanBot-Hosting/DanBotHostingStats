//let client = require("../../../../index.js").client;
const fetch = require('node-fetch');
module.exports = (client, message, editedMessage) => {
  let whitelisted = ['137624084572798976'];
    if (!whitelisted.includes(message.author.id)) {
    const inviteREE = new RegExp(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g);
    if (inviteREE.test(editedMessage.content)) {
        const msgcontent = editedMessage.content
        code = msgcontent.replace(/(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/?/g, "");
        console.log(code)
        fetch(`https://discordapp.com/api/invite/${code}`)
        .then((res) => res.json())
        .then((json) => {
            if (json.message === 'Unknown Invite') {
               //Do nothing
               console.log(json.message)
            } else  {
                message.delete()
                console.log('uh oh')
                console.log(json)
            }
        });
    }
}

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
