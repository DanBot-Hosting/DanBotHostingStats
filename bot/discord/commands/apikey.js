const Discord = require("discord.js");
const axios = require("axios");

exports.run = async (client, message, args) => {
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
      const embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle("DanBot Hosting - Api Key")
        .setDescription(
          `An error occured while getting your API key: ${request.data.error}!`,
        )
        .setTimestamp();
      message.reply(embed);
    } else {
      client.users.cache
        .get(message.user.id)
        .send(
          "Your api key is " +
            request.data.result +
            ". (Without the dot at the end).",
        );
    }
  } catch (error) {
    console.log("wow the bot tried committing self death - " + error);
  }
};
