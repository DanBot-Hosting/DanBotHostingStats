const Discord = require("discord.js");
exports.run = async (client, message, args) => {

    // for the people that are reading this i know i could have done half of the things in a better way but im too lazy

        let user = userPrem.fetch(message.author.id);

        const member = args[1];
        let length = member.length
        if (isNaN(member))  return message.reply(`Please specify an ID`);

        if (length > 17) {

        if (user.donated == null) {
          message.channel.send(
            "You're not a premium user, to get access to premium you can either boost us for 2 **Premium Servers**, or buy a server (1server/$1)"
          );
          return;
        }

        if (user.donated - user.used <= 0) {
          message.channel.send("You are at your premium server limit");
          return;
        }

        userPrem.set(
          message.author.id + ".donated",
          userPrem.fetch(message.author.id).donated - 1
        );
        userPrem.set(
          member + ".donated",
          userPrem.fetch(member).donated + 1
        );
        message.channel.send("Successfully transferred the server! ");

        if (userPrem.get(member + ".used") == null) {
          userPrem.set(member + ".used", 0);
        }
      } else {
        message.channel.send("Please provide a valid user ID!")
      }
};
