const exec = require('child_process').exec;
exports.run = (client, message, args) => {
  if (message.author.id == config.DiscordBot.ownerID) {
    const start = process.hrtime();
    exec(`${args.join(" ")}`, (error, stdout) => {
      let response = (error || stdout);
      if (response.length > 1024) console.log(response), response = 'Output too long.';
      const end = process.hrtime(start);
      message.channel.send("", {
        embed: new Discord.RichEmbed()
        .setDescription("```"+response+"```")
        .setTimestamp()
        .setColor("RANDOM")
      })
    });
  }
}