const exec = require('child_process').exec;

exports.run = async(client, message, args) => {

    //Checks if the user has the Bot System Administrator Role.
    if (!message.member.roles.cache.find(r => r.id === "898041743566594049")) return;
    
    exec(`git pull`, (error, stdout) => {
            let response = (error || stdout);
            if (!error) {
                if (response.includes("Already up to date.")) {
                } else {
                    client.channels.cache.get('898041843902742548').send('**[AUTOMATIC]** \nNew update on GitHub. Pulling Files. \n\nLogs: \n```' + response + "```" + "\n\n\n**Restarting Discord Bot.**");

                    message.channel.send('Pulling files from GitHub.');
                    setTimeout(() => {
                        process.exit();
                    }, 1000);
                };
            };
      });
}
