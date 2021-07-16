const db = require("quick.db");

exports.run = async (client, message, args) => {
  if (!message.member.roles.cache.some("639489438036000769"))
    return message.reply("You cannot use this command.");

  let action, lowercase;

  if (message.content.includes("--action=")) {
    const whichArg = args.findIndex((x) => x.includes("--action="));
    if (whichArg < 0) return;
    let arg = args[whichArg];

    action = arg.split("--action=")[1].toLowerCase();
    arg = arg.split(`--action=${action}`).join();
    if (!arg) args.splice(1, whichArg);
    else args[whichArg] = arg;
  }

  if (message.content.includes("--lowercase=")) {
    const whichArg = args.findIndex((x) => x.includes("--lowercase="));
    if (whichArg < 0) return;
    let arg = args[whichArg];

    lowercase = arg.split("--lowercase=")[1].toLowerCase();
    arg = arg.split(`--lowercase=${lowercase}`).join();
    if (!arg) args.splice(1, whichArg);
    else args[whichArg] = arg;
  }

  function sendModLog(content) {
    const channel = client.channels.cache.get(config.DiscordBot.modLogs);
    channel.send(content);
  }

  args.shift();
  const subName = args[0] ? args.shift().toLowerCase() : undefined;

  switch (subName) {
    case "set":
    case "add":
      if (!args[0])
        return message.reply(
          "You must provide what word you would like to blacklist. Usage: `DBH!staff blwords set frick --action=ban`"
        );
      if (!action)
        return message.reply("You must provide an action for the bad word.");
      const actions = [
        "warn",
        "ban",
        "kick",
        "delete",
        "mute",
        "delete&mute",
        "warn&delete"
      ];
      if (!actions.includes(action))
        return message.reply(
          `Invalid action provided. Valid actions: ${actions
            .map((x) => `\`${action}\``)
            .join(", ")}`
        );
      if (!Boolean(lowercase))
        return message.reply(
          "Invalid lowercase form. The lowercase option must be boolean (true/false)."
        );
        if (db.has(`blWords.${args[0]}`)) return message.reply("This blacklisted word already exists.");
      db.set(`blWords.${args[0]}`, {
        name: args[0],
        action: action,
        author: message.author.id,
        lowercase: JSON.parse(lowercase),
      });
      message.reply("Successfully set the word you provided as blacklisted.");
      sendModLog(
        new MessageEmbed({
          title: "Blacklisted Word: Added!",
          description: "A new blacklisted word was added.",
          fields: [
            {
              name: "Word:",
              value: `(Possible Gore): || ${args[0]} ||`,
              inline: true,
            },
            {
              name: "Added By:",
              value: `${message.author}`,
              inline: true,
            },
            {
              name: "Action:",
              value: action,
              inline: true,
            },
          ],
          timestamp: Date.now(),
        })
      );
      break;

    case "delete":
    case "remove":
      if (!args[0]) return message.reply("Please provide a word to remove.");

      if (!db.has(`blWords.${args[0]}`))
        return message.reply("The word you provided isn't blacklisted.");
      db.delete(`blWords.${args[0]}`);
      message.reply("Successfully removed that word.");
      sendModLog(
        new MessageEmbed({
          title: "Blacklisted Word: Removed!",
          description: "A blacklisted word was removed.",
          fields: [
            {
              name: "Word:",
              value: `(Possible Gore): || ${args[0]} ||`,
              inline: true,
            },
            {
              name: "Removed By:",
              value: `${message.author}`,
              inline: true,
            },
          ],
        })
      );
      break;

    case "list":
    case "all":
      const allWords = db.get("blWords");
      if (!allWords || !Object.values(allWords))
        return message.reply("There are no blacklisted words.");
      message.reply(
        new MessageEmbed({
          title: "All Blacklisted Words.",
          description: Object.values(allWords)
            .map((x) => `\`${x}\``)
            .join(", ")
            .substr(0, 4096),
          footer: "Use DBH!staff blwords info {word name} for more info.",
        })
      );
    case "info":
      if (!args[0])
        return message.reply("Please provide a word to check the info of.");
      const word = db.get(`blWords.${args[0]}`);
      if (!word) return message.reply("This word has not been blacklisted.");
      return message.reply(
        new MessageEmbed({
          title: "Blacklisted Word Info:",
          fields: [
            {
              name: "Name:",
              value: `|| ${word.name} ||`,
              inline: true,
            },
            {
              name: "Added By:",
              value: `<@${word.author}>`,
              inline: true,
            },
            {
              name: "Action:",
              value: word.action,
              inline: true,
            },
          ],
        })
      );
  }
};
