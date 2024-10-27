const Discord = require("discord.js");

/**
 *
 * Fixes your DB Schema incase commands start failing.
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @returns
 */
exports.run = async (client, message) => {
  // Request user data.
  const data = await userData.get(message.author.id);

  // Check if the user has an account.
  if (!data) return message.reply("You do not have an account.");

  let replyMessage;

  // Check if the user data is mistakenly stored as a string.
  if (typeof data == "string") {
    try {
      // Sometimes the data is stored as a string, we're converting it back to a JSON object.
      const userAccount = JSON.parse(data);

      // Update the user data.
      await userData.set(message.author.id, userAccount);

      // Notify the user.
      replyMessage = "Your account has been fixed.";
    } catch (Error) {
      replyMessage =
        "Unable to automatically fix your account. Please contact the support team.";
    }
  } else {
    replyMessage = "Your account is already in the correct format.";
  }

  return await message.reply(replyMessage);
};

exports.description = "Fixes your DB Schema incase commands start failing.";
