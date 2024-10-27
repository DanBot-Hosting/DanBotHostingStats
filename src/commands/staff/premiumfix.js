const Discord = require("discord.js");
const Axios = require("axios");

const Config = require("../../../config.json");

exports.description = "Fixes a user's premium count.";

/**
 * Premium server count fix command. Locked to the staff.
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {
  if (
    !message.member.roles.cache.find(
      (r) => r.id === Config.DiscordBot.Roles.Staff
    )
  )
    return;

  if (!args[1]) {
    return message.reply("Please specify a user!");
  } else {
    const replyMsg = await message.reply("Starting calculation...");

    try {
      let selectedUser = client.users.cache.get(
        args[1].match(/\d{17,19}/).length == 0
          ? args[1]
          : args[1].match(/\d{17,19}/)[0]
      );
      selectedUser = await selectedUser;

      const userAccount = await userData.get(selectedUser.id);

      if (userAccount == null || userAccount.consoleID == null) {
        if (selectedUser.id === message.author.id) {
          return message.reply(
            `You do not have a panel account linked, please create or link an account.\n\`${Config.DiscordBot.Prefix}user new\` - Create an account\n\`${Config.DiscordBot.Prefix}user link\` - Link an account`
          );
        } else {
          return message.reply(
            "That user does not have a panel account linked."
          );
        }
      }

      const response = await Axios({
        url:
          Config.Pterodactyl.hosturl +
          "/api/application/users/" +
          userAccount.consoleID +
          "?include=servers",
        method: "GET",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
          Authorization: "Bearer " + Config.Pterodactyl.apikey,
          "Content-Type": "application/json",
          Accept: "Application/vnd.pterodactyl.v1+json",
        },
      });

      const preoutput = response.data.attributes.relationships.servers.data;

      let actualPremiumServersUsed = 0;

      for (let index = 0; index < preoutput.length; index++) {
        if (Config.DonatorNodes.includes(preoutput[index].attributes.node))
          ++actualPremiumServersUsed;
      }

      const userPremData = await userPrem.get(selectedUser.id);

      const storedPremiumServersUsed = userPremData.used;

      if (actualPremiumServersUsed != storedPremiumServersUsed) {
        await userPrem.set(selectedUser.id, {
          used: actualPremiumServersUsed,
          donated: userPremData.donated,
        });
        replyMsg.edit("That user's premium server count has been fixed!");
      } else {
        replyMsg.edit("That user has the correct premium server count!");
      }
    } catch (err) {
      replyMsg.edit(
        `<:No:768256005426511912> An error occurred\n\`\`\`${err.message}\`\`\``
      );
    }
  }
};
