//let client = require("../../../../index.js").client;

module.exports = (client, message) => {
    //if(message.content.toLowerCase().includes("tiktok")) {message.reply('Ew. Get out here with that crap :bammer:'), message.delete() }
    if (message.content.toLowerCase().includes("discord.gg")) {
        message.delete();
    } else if (message.content.toLowerCase().includes("discord.com")) {
        message.delete()
    } else if (message.content.toLowerCase().includes(" ឵឵")) {
        message.delete()
    } else if (message.content.toLowerCase().includes(""))

        /*    
            const Tesseract = require("tesseract.js")
            if (message.attachments.size > 0) {
                message.attachments.forEach(attachment => {
                    //console.log(attachment.url)
                Tesseract.recognize(
                    attachment.url,
                    'eng',
                  ).then(({ data: { text } }) => {  
                      if (text.includes("There was an error attempting to establish")) {
                          message.reply('It looks like you are getting a error with the websocket. Try refreshing if that doesnt work please check <#738530520945786921>')
                      } else if (text.includes("HTTP/E_CONN_REFUSED")) {
                          message.reply('It looks like you might be getting a `HTTP/E_CONN_REFUSED` error. \nThis error is normally found in the file management. Please refresh. \nIf that doesnt fix check <#738530520945786921> for any possible outages. No outages but still got the error? make a ticket!')
                      } else if (text.includes("We were unable to locate the requested resource on the server.")) {
                          message.reply('Uh oh. Server you are trying to access doesnt exist. Did you get the wrong url or was the server deleted?')
                      } else if (text.includes("You do not have permission to access this resource on this server.")) {
                          message.reply('The server you are trying to access you do not have perms to view. If you did before the user might of removed you as subuser.')
                      } else if (text.includes('Gateway Timeout')) {
                          message.reply('It looks like you are getting a `Gateway Timeout` error. This normally happens when a outage is happening. \nIf nothing is posted in <#738530520945786921> then you might just be having the issue. \nIt should fix its self soon')
                      } else if (text.includes('instal process')) {
                          message.reply('It looks like your server might be stuck on installing. Please open a ticket so we can fix this for you.')
                      } else {
                        message.react('👀');
                      }
                    message.channel.send(text)
                  })
                });
            };
            */

        if (message.channel.type == "dm") {
            if (message.author.id == "137624084572798976") {
                const args = message.content.trim().split(/ +/g);
                client.channels.get(args[0]).send(message.content.split(' ').slice(1).join(' '))
            }
        };


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

    //Requests channel auto react
    if (message.channel.id == config.DiscordBot.requestsChannel) {
        message.react('✅');
    }

};