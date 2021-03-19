exports.run = async (client, message, args) => {
  userData.delete(message.author.id);
  message.channel.send("You have unlinked this account!");
};
