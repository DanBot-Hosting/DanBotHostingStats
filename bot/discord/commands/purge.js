const Discord = require("discord.js");
exports.run = (client, message, args) => {
  const prefixtouse = config.prefix;
  const usage = new Discord.MessageEmbed()
    .setColor(0x00a2e8)
    .setTitle("Command: " + prefixtouse + "purge")
    .addField("Usage", prefixtouse + "purge <amount> @Someone")
    .addField("Example", prefixtouse + "purge 20 spam")
    .setDescription(
      "Description: " + "Purges the channels messages (min 2 max 100)"
    );
  if (message.member.roles.cache.find((r) => r.id === "748117822370086932")) {
    const user = message.mentions.users.first();
    const amount = !!parseInt(message.content.split(" ")[2])
      ? parseInt(message.content.split(" ")[2])
      : parseInt(message.content.split(" ")[1]);
    let reason = args[3] || `Moderator didn't give a reason.`;
    if (!amount) return message.channel.send(usage);
    if (!amount && !user) return message.channel.send(usage);
    message.channel.messages
      .fetch({
        limit: amount,
      })
      .then((messages) => {
        if (user) {
          const filterBy = user ? user.id : client.user.id;
          messages = messages
            .filter((m) => m.author.id === filterBy)
            .array()
            .slice(0, amount + 1);
        }
        if (amount <= 1)
          return message.channel.send("Can only delete a min of 2 messages");
        if (amount >= 100)
          return message.channel.send("Can only delete a max of 100 messages");
        message.channel
          .bulkDelete(messages, true)
          .catch((error) => console.log(error.stack));
        message.channel.send(
          "***The server messages/users messages has been successfully purged! :white_check_mark:***"
        );
        const embed = new Discord.MessageEmbed()
          .setColor(0x00a2e8)
          .addField("Moderator", message.author.tag, true)
          .addField("Purge Amount", amount)
          .addField("In channel", message.channel.name, true)
          .addField("Reason", reason, true)
          .setFooter("Time used: " + message.createdAt.toDateString());
        return client.channels.cache.get(config.DiscordBot.modLogs).send({
          embed,
        });
      });
  }
};
