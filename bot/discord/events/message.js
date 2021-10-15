const fetch = require('node-fetch');
const axios = require('axios');

module.exports = (client, message) => {
    const swears = [
        'nigga', 'nigger', 'darkisthebestpersoneverireallylovehim', 'faggot', 'fag'
    ]
    if (swears.some(x => message.content.toLowerCase().includes(x))) {
        if (message.author.bot) {
            message.reply('said a blacklisted word, Its been kicked from the server')
            message.delete()
            return message.member.kick()
        }
        message.reply('Do __NOT__ use that word in this server. You will get muted next time...')
        message.delete()
        const channel = client.channels.cache.get('898041913947602945')
        const bword = new Discord.MessageEmbed()
            .setTitle('${$message.author.tag} Said A Blacklisted word')
            .setDescription(`${message.content}`)
            .setFooter("This message Includes a blacklisted word")
            .setColor('RED')
        channel.send(bword)
    }
    if (message.channel.id === "781099821561544744") { // I could not find out what ID this is sorry
        axios({
            url: `https://discord.com/api/v9/channels/${message.channel.id}/messages/${message.id}/crosspost`,
            method: 'POST',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': "Bot " + config.DiscordBot.Token,
                'Content-Type': 'application/json',
            },
        }).then(response => {
            /* If you guys didnt know this. solo sucks */
        })
    }

    let whitelisted = ['137624084572798976'];
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
    if (message.channel.id === "898041855135068221") {
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
                client.channels.cache.get('898041919022723072').send(message.author.username + " (ID: " + message.author.id + ", PING: <@" + message.author.id + ">)" + "\n" + message.content.replace('@', '@|'))
            }
        }
    };

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
            '898041854262648842', '898041855135068221',
            '898041857550995506', '898041858666668092',
            '898041859681701948', '898041861040664576',
            '898041865616650240', '898041867856384011',
            '898041869362155530', '898041877243252796',
            '898041898835509328', '898041896956469249',
            '898041895987585024', '898041894746066985',
            '898041893508755486', '898041892279836692'
        ]
        //Channel checker

        if ((blacklisted.includes(message.channel.id) || (message.channel.id == '898041849783148585' && command != 'snipe')) && (message.member.roles.cache.find(x => x.id === '898041751099539497') == null && message.member.roles.cache.find(x => x.id === '898041743566594049') == null) &&
            !(message.channel.id === '898041853096628267' && command === 'info')) return;

        //Check if the commands are disabled.

        if (webSettings.get('commands') !== false && message.member.roles.cache.get('898041741695926282') == null) {
            message.channel.send('Discord Bot commands are currently disabled...\n reason: `' + webSettings.get('commands') + '`');
            return;
        }

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