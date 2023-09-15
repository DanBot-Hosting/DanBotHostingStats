const Discord = require("discord.js");
const axios = require("axios");

exports.run = async (client, message, args) => {
  if(!message.member.roles.cache.find((r) => r.id === "898041755419693126")) {
      return message.reply("Only beta testers can use this command!");
  }

  try {
    const request = await axios({
      url: config.BotApi.Url,
      method: "POST",
      followRedirect: true,
      maxRedirects: 5,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        discordid: message.user.id,
        key: config.BotApi.AdminKey,
      },
    });

    if (request.data.error !== null) {
      message.reply(`An error occured while getting your API key: ${request.data.error}!`);
    } else {
      try {
        message.author.send(`Your API key is: \`${request.data.result}\``);
      } catch(err) {
        message.reply("I could not DM you!");
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};
