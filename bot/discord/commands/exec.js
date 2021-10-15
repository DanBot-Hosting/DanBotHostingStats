const exec = require('child_process').exec;
exports.run = (client, message, args) => {
    if (message.member.roles.cache.find(r => r.id === "898041743566594049")) {

        exec(`${args.join(" ")}`, (error, stdout) => {

            let response = (error || stdout);

            if (response.length > 1024) console.log(response), response = 'Output too long.';

            message.channel.send("", {
                embed: new Discord.MessageEmbed()
                    .setDescription("```" + response + "```")
                    .setTimestamp()
                    .setColor("RANDOM")
            })

        });

    }
}
