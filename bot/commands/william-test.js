const cap = require("../util/cap");

exports.run = async (client, message, args) => {
    if(message.author.id !== "853158265466257448")) {
        return message.reply("You are not allowed to use this command!");
    }

    try {
      return message.reply(cap("hello", 3));
    } catch(err) {
      return message.reply(`\`\`\`${err.message}\`\`\``);
    }
};
