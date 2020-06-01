module.exports = (client, message) => {
    if(message.content.toLowerCase().includes("tiktok")) { message.delete() }
    if(message.content.toLowerCase().includes("discord.gg")) { 
        if(message.channel.id === '717146816918847489') {
            return;
        } else {
            message.delete();
            message.reply('No advertising here. Check out <#717146816918847489> for advertising!')
        }
    }


    const prefix = config.DiscordBot.Prefix;
    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandargs = message.content.split(' ').slice(1).join(' ');
    const command = args.shift().toLowerCase();
    console.log(chalk.magenta("[DISCORD] ") + chalk.yellow(`[${message.author.username}] [${message.author.id}] >> ${prefix}${command} ${commandargs}`));
        try {
            let commandFile = require(`../commands/${command}.js`);
            commandFile.run(client, message, args);
        } catch (err) {
                if (err instanceof Error && err.code === "MODULE_NOT_FOUND") {
                    return;
             }
    }  
};