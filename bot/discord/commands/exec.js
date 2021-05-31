const exec = require('child_process').exec;
exports.run = (client, message, args) => {
    if (message.member.roles.cache.find(r => r.id === "639489438036000769")) { // changed the role to administrator only so i can install a package.

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
