const fetch = require('node-fetch');
const tags = require('../models/tags');

module.exports = (client, message) => {
    let whitelisted = ['137624084572798976', '293841631583535106', '251428574119067648', '338192747754160138'];
    if (!whitelisted.includes(message.author.id)) {
    const inviteREE = new RegExp(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g);
    if (inviteREE.test(message.content.includes())) {
        const msgcontent = message.content
        code = msgcontent.replace(/(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/?/g, "");
        console.log(code)
        fetch(`https://discordapp.com/api/invite/${code}`)
        .then((res) => res.json())
        .then((json) => {
            if (json.message === 'Unknown Invite') {
               //Do nothing
               console.log(json.message)
            } else  {
                message.delete()
                console.log('uh oh')
                console.log(json)
            }
        });
    }
}
    if (message.author.id == "265240267215339522") { 
        if (message.content.includes("sus")) {
            message.delete();
            message.reply('no sus...')
        }
    }

    //Auto reactions on suggestions
    if (message.channel.id == "740302560488980561") {
        if (message.content.includes(">")) {

        } else {
            message.react('👍')
            setTimeout(() => {
                message.react('👎')
            }, 200);
        }
    }

    // if (message.attachments.size > 0) {
    //     if (message.attachments.every(attachIsImage)) {
    //         const Tesseract = require("tesseract.js")
    //         message.attachments.forEach(attachment => {
    //             Tesseract.recognize(
    //                 attachment.url,
    //                 'eng',
    //             ).then(({
    //                 data: {
    //                     text
    //                 }
    //             }) => {
    //                 if (text.includes("There was an error attempting to establish")) {
    //                     message.reply('It looks like you are getting a error with the websocket. Try refreshing if that doesnt work please check <#738530520945786921>')
    //                 } else if (text.includes("HTTP/E_CONN_REFUSED")) {
    //                     message.reply('It looks like you might be getting a `HTTP/E_CONN_REFUSED` error. \nThis error is normally found in the file management. Please refresh. \nIf that doesnt fix check <#738530520945786921> for any possible outages. No outages but still got the error? make a ticket!')
    //                 } else if (text.includes("We were unable to locate the requested resource on the server.")) {
    //                     message.reply('Uh oh. Server you are trying to access doesnt exist. Did you get the wrong url or was the server deleted?')
    //                 } else if (text.includes("You do not have permission to access this resource on this server.")) {
    //                     message.reply('The server you are trying to access you do not have perms to view. If you did before the user might of removed you as subuser.')
    //                 } else if (text.includes('Gateway Timeout')) {
    //                     message.reply('It looks like you are getting a `Gateway Timeout` error. This normally happens when a outage is happening. \nIf nothing is posted in <#738530520945786921> then you might just be having the issue. \nIt should fix its self soon')
    //                 } else if (text.includes('instal process')) {
    //                     message.reply('It looks like your server might be stuck on installing. Please open a ticket so we can fix this for you.')
    //                 } else if (text.includes('invalid ELF header')) {
    //                     message.reply('Looks like you might be getting a error about a invalid ELF header on a node.js server. If this is happening please delete `node_modules` folder and let it auto reinstall next time you start the server. This should fix the problem!')
    //                 } else if (text.includes(`find module '/home/container/index.js'`)) {
    //                     message.reply('Looks like the server cant find a `index.js` file. Please check make sure you uploaded your main file and changed startup prams to make sure the server is starting with the correct file. \nIf that doesnt help please wait for a human to come help you.')
    //                 } else if (text.includes('Please try re-compiling or re-installing')) {
    //                     message.channel.send('Looks like you might of uploaded your `node_modules` folder. Please delete this folder and when you server starts modules will be auto installed.')
    //                 }
    //             })
    //         })
    //     }
    // }

    // function attachIsImage(msgAttach) {
    //     var url = msgAttach.url;
    //     //True if this url is a png image.
    //     return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1;
    // }


    if (message.channel.type == "dm") {
        if (message.author.id == "137624084572798976") {
            const args = message.content.trim().split(/ +/g);
            client.channels.get(args[0]).startTyping()
            setTimeout(async () => {
                client.channels.get(args[0]).send(message.content.split(' ').slice(1).join(' '))
            }, 5000)
            client.channels.get(args[0]).stopTyping()
        }
    };

    if(message.author.bot)return; // to stop bots from creating accounts, tickets and more.
    const prefix = config.DiscordBot.Prefix;
    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandargs = message.content.split(' ').slice(1).join(' ');
    const command = args.shift().toLowerCase();
    console.log(chalk.magenta("[DISCORD] ") + chalk.yellow(`[${message.author.username}] [${message.author.id}] >> ${prefix}${command} ${commandargs}`));
    try {
        let blacklisted = [
            '754441222424363088', '739231758087880845',
            '738839334333186068', '738840097218101309',
            '738844675372482720', '738846229919825992',
            '738548111323955270'
        ]
        //Channel checker

        if (blacklisted.includes(message.channel.id) && (message.member.roles.find(x => x.id == '748117822370086932') == null) &&
            !(message.channel.id == '738548111323955270' && command == 'info')) return;

        let commandFile = require(`../commands/${command}.js`);
        commandFile.run(client, message, args);

        if (!commandFile) {
            tags.findOne({
                    Guild: message.guild.id,
                    Command: cmd
                },
                async (err, data) => {
                    if (err) throw err;
                    if (data) {
                        return message.channel.send(data.Content);
                    } else return;
                }
            );
            return;
        }

    } catch (err) {
        if (err instanceof Error && err.code === "MODULE_NOT_FOUND") {
            return;
        }
    }

};
