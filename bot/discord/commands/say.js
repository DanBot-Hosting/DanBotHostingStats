exports.run = async (client, message) => {
  const args = message.content.split(" ").slice(1).join(" ");

  let ids = ["137624084572798976", "293841631583535106"];
  if (!ids.includes(message.author.id)) {
    return message.channel.send(
      "You dont have perms to use this command. Its for my owner."
    );
  }

  message.delete();
  message.channel.send(args);
};
