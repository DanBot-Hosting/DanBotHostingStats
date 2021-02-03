const fetch = require('node-fetch');

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
                client.channels.cache.get('801847783019118663').send(message.author.username + " (ID: " + message.author.id + ", PING: <@" + message.author.id + ">)" + "\n" +  message.content)
            }
        }
    };

    if(message.author.bot) return; // to stop bots from creating accounts, tickets and more.
    if(message.channel.type === "dm") return; //stops commands working in dms
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

        if (blacklisted.includes(message.channel.id) && (message.member.roles.cache.find(x => x.id === '748117822370086932') == null) &&
            !(message.channel.id === '738548111323955270' && command === 'info')) return;
        if (command === "server") {

            //Cooldown setting
            let cooldown = {};
            if (cooldown[message.author.id] == null) {
                cooldown[message.author.id] = {
                    nCreate: null,
                    pCreate: null,
                    delete: null
                }
            }

            if (!args[0]) {
                let commandFile = require(`../commands/server/help.js`);
                commandFile.run(client, message, args, cooldown);
            } else {
                let commandFile = require(`../commands/server/${args[0]}.js`);
                commandFile.run(client, message, args, cooldown);
            }
        } else {
            let commandFile = require(`../commands/${command}.js`);
            commandFile.run(client, message, args);
        }
    } catch (err) {
        console.log(err)
        if (err instanceof Error && err.code === "MODULE_NOT_FOUND") {
            return;
        }
    }

};
