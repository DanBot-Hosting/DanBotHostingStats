module.exports = async (client, oldMember, newMember) => {
  // If user nickname changes.
  if (oldMember.displayName !== newMember.displayName) {
    if (newMember.displayName.toLowerCase().includes("soloisaslut")) {
      return newMember.setNickname(
        newMember.displayName.replace(/soloisaslut/i, "SoloIsAHottie"),
        "Naughty..."
      );
    }

    if (
      [
        "!",
        "`",
        "#",
        "'",
        "-",
        ".",
        "_",
        '"',
        "+",
        "*",
        "£",
        "$",
        "%",
        "^",
        "&",
        "(",
        ")",
        ":",
        ";",
        ",",
        "?",
        "'",
      ].some((r) => newMember.displayName.startsWith(r))
    ) {
      newMember.setNickname("⚠️HOISTER ALERT ⚠️");
    }

    // Make a new RichEmbed
    const embed = new Discord.MessageEmbed()
      .setTitle("User Nickname changed.")
      .setDescription(`User: ${oldMember} Nickname has changed.`)
      .addField("Old Nickname", oldMember.displayName, true)
      .addField("New Nickname", newMember.displayName, true)
      .setColor(0xff7700)
      .setTimestamp(new Date());

    client.channels.cache.get(config.DiscordBot.oLogs).send(embed);

    return;
  }
};
