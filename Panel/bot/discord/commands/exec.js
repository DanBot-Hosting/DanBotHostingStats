const exec = require('child_process').exec;
exports.run = (client, message, args) => {
    if(message.member.roles.find(r => r.name === "Owner")){
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