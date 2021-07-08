const fetch = require('node-fetch');
const axios = require('axios');

const blacklistedWords = [
    'rape', 'nigga', 'nigger', 'jew'
]

module.exports = (client, message) => {
    if(blacklistedWords.includes(message.content.toLowerCase())) { message.delete(), message.reply('Do __NOT__ use that word in this server. You will get muted next time...')}
    if(message.channel.id === "781099821561544744") {
        axios({
            url: `https://discord.com/api/v9/channels/${message.channel.id}/messages/${message.id}/crosspost`,
            method: 'POST',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': "Bot " + config.DiscordBot.Token,
                'Content-Type': 'application/json',
            },
        }).then(response => { /* If you guys didnt know this. solo sucks */ })
    }

    let whitelisted = ['137624084572798976', '293841631583535106', '251428574119067648'];
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
                    } else {
                        message.delete()
                        console.log('uh oh')
                        console.log(json)
                    }
                });
        }
    }


    //Auto reactions on suggestions
    if (message.channel.id === "740302560488980561") {
        if (message.content.includes(">")) {

        } else {
            message.react('👍')
            setTimeout(() => {
                message.react('👎')
            }, 200);
        }
    }

    if (message.channel.type === "dm") {
        if (message.author.id === "137624084572798976") {
            const args = message.content.trim().split(/ +/g);
            client.channels.cache.get(args[0]).send(message.content.split(' ').slice(1).join(' '))
        } else {
            if (message.author.id === "640161047671603205") {

            } else {
                client.channels.cache.get('801847783019118663').send(message.author.username + " (ID: " + message.author.id + ", PING: <@" + message.author.id + ">)" + "\n" + message.content.replace('@', '@|'))
            }
        }
    }
    ;

    if (message.author.bot) return; // to stop bots from creating accounts, tickets and more.
    if (message.channel.type === "dm") return; //stops commands working in dms
    const prefix = config.DiscordBot.Prefix;
    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandargs = message.content.split(' ').slice(1).join(' ');
    const command = args.shift().toLowerCase();
    console.log(chalk.magenta("[DISCORD] ") + chalk.yellow(`[${message.author.username}] [${message.author.id}] >> ${prefix}${command} ${commandargs}`));
    try {
        let blacklisted = [
            '739231758087880845', '786363228287664190',
            '738839334333186068', '738840097218101309',
            '738844675372482720', '738846229919825992',
            '738548111323955270', '739175011721413009',
            '738785336187945051', '793547999753666620'
        ]
        //Channel checker

        if ((blacklisted.includes(message.channel.id) || (message.channel.id == '754441222424363088' && command != 'snipe')) && (message.member.roles.cache.find(x => x.id === '748117822370086932') == null && message.member.roles.cache.find(x => x.id === '778237595477606440') == null) &&
            !(message.channel.id === '738548111323955270' && command === 'info')) return;
        if (command === "server" || command === "user" || command === "staff" || command === "dan" || command === "ticket") {
            //Cooldown setting
            if (!args[0]) {
                let commandFile = require(`../commands/${command}/help.js`);
                commandFile.run(client, message, args);
            } else {
                let commandFile = require(`../commands/${command}/${args[0]}.js`);
                commandFile.run(client, message, args);
            }
        } else {
            let commandFile = require(`../commands/${command}.js`);
            commandFile.run(client, message, args);
        }
    } catch (err) {
        console.log(err)
    }
};
