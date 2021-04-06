const exec = require('child_process').exec;
exports.run = async (client, message, args) => {
    if (message.member.roles.cache.find(r => r.id === "778237595477606440")) {
        exec(`git pull`, (error, stdout) => {
            let response = (error || stdout);
            if (!error) {
                if (response.includes("Already up to date.")) {
                    message.channel.send('Bot already up to date. No changes since last pull')
                } else {
                    message.channel.send('Pulled from GitHub. Restarting bot. \n\nLogs: \n```' + response + "```")
                    setTimeout(() => {
                        process.exit();
                    }, 1000)
                }
                ;
            }
        });
    } else {
        message.channel.send('OwO')
    }
}