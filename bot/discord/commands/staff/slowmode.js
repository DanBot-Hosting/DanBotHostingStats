exports.run = (client, message, args) => {
  try {
    // Check if user has the mod role
    if (!message.member.roles.cache.find((r) => r.id === "898041748817842176")) return;

    if(!args[2]) return message.reply("Please provide a time!");

    const slowmode = args[2];

    if(slowmode <= 0 || slowmode === "off" || slowmode === "disable") {
        message.channel.setRateLimitPerUser(0);
        message.reply("Slowmode has been disabled.");
        return;
    }

    if(isNaN(slowmode)) return message.reply("Please specify a valid number.");

    if(slowmode > 21600) return message.reply("You can only set the slowmode between \`0\` and \`21600\` seconds!");

    message.channel.setRateLimitPerUser(slowmode);

    const set = new Discord.EmbedBuilder()
        .setColor(client.config_embeds.default)
        .setDescription(`${emoji.successful} `)

    message.reply(`Slowmode has been set to \`${slowmode}\` second${slowmode === 1 ? "" : "s"}.`);
  } catch(err) {
    message.channel.send(`\`\`\`${err.message}\`\`\``);
  }
};
