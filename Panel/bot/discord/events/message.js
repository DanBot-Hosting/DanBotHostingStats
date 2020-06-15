module.exports = (client, message) => {
    if(message.content.toLowerCase().includes("tiktok")) {message.reply('Ew. Get out here with that crap :bammer:'), message.delete() }
    if(message.content.toLowerCase().includes("discord.gg")) { 
        if(message.channel.id === '717146816918847489') {
            return;
        } else if(message.channel.id === '719259195471429722') {
            return;
        } else {
            message.delete();
            message.reply('No advertising here. Check out <#717146816918847489> or <#719259195471429722> for advertising!')
        }
    }

    if (message.channel.type == "dm") {
        if(message.author.id == "137624084572798976") {
        const args = message.content.trim().split(/ +/g);
        client.channels.get(args[0]).send(message.content.split(' ').slice(1).join(' '))
    }};


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