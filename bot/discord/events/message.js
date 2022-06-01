const prefix = config.DiscordBot.Prefix;

const whitelisted = { // commands inside the array means only said commands are whitelisted. if empty then all commands are allowed
    '898041849783148585': ['snipe'], // lounge
    '898041853096628267': ['info'], // add bot channel
    '898041866589700128': [], // command channel
    '898041878447013948': [], // command channel
    '898041850890440725': [], // command channel
}

const whitelistedKeys = Object.keys(whitelisted);

module.exports = async (client, message) => {


    const args = message.content.slice(prefix.length).trim().split(/ +/g);


    if (message.mentions.users.size > 0 && [...new Set(message.mentions.users.map(x => x.id))].size >= 20) {
        message.member.ban({ reason: 'Suspected raid. Pinging more than 20 users.' });
        message.channel.send(`${message.member.toString()} has been banned for pinging more than 20 users`);

        client.channels.cache.get(config.DiscordBot.oLogs).send(new Discord.MessageEmbed()
            .setTitle("User banned for pinging more than 20 users")
            .addField("User", "Banned " + message.member.toString(), true)
            .setColor(0xFF7700)
            .setTimestamp());
    };


    //Auto reactions on suggestions
    if ((message.channel.id == "898041855135068221" || message.channel.id == "951252958316728340") && !message.content.includes(">")) {
        await message.react('👍');
        message.react('👎');

    }

    if (message.channel.type == "dm") {
        if (message.author.id == "137624084572798976")
            client.channels.cache.get(args[0]).send(message.content.split(' ').slice(1).join(' '))
        else if (message.author.id != client.user.id)
            client.channels.cache.get('898041919022723072').send(message.author.username + " (ID: " + message.author.id +
                ", PING: <@" + message.author.id + ">)" + "\n" + message.content.replace('@', '@|'))
    }

    if (!message.content.startsWith(prefix) || message.channel.type == "dm" || message.author.bot) return;

    const commandargs = message.content.split(' ').slice(1).join(' ');
    const command = args.shift().toLowerCase();


    console.log(chalk.magenta("[DISCORD]"),
        chalk.yellow(`[${message.author.username}] [${message.author.id}] >> ${prefix}${command} ${commandargs}`));

    let actualExecutorId;
    try {

        //Channel checker
        if (!(['898041751099539497', '898041743566594049'].some(allowed => message.member.roles.cache.has(allowed))) || // user is not a staff member
            !(whitelistedKeys.includes(message.channel.id) && (whitelisted[message.channel.id].length == 0 || whitelisted[message.channel.id].includes(command)))) return;

        if (sudo.get(message.member.id) && message.member.roles.cache.find(r => r.id === "898041747597295667") && args[0] != "sudo") { //Doubble check the user is deffinaly allowd to use this command
            actualExecutorId = JSON.parse(JSON.stringify({ a: message.member.id })).a; // Deep clone actual sender user ID

            console.log(`Command being executed with sudo by ${actualExecutorId}`);
            let userToCopy = sudo.get(actualExecutorId);

            // await message.guild.members.fetch(userToCopy);  //Cache user data
            // await client.users.fetch(userToCopy); //Cache user data

            message.guild.member.id = userToCopy;
            message.author.id = userToCopy;
        };

        if (command === "server" || command === "user" || command === "staff" || command === "dan" || command === "ticket") {
            //Cooldown setting
            if (!args[0]) {
                let commandFile = require(`../commands/${command}/help.js`);
                await commandFile.run(client, message, args);
            } else {
                let commandFile = require(`../commands/${command}/${args[0]}.js`);
                await commandFile.run(client, message, args);
            }
        } else {
            let commandFile = require(`../commands/${command}.js`);
            await commandFile.run(client, message, args);
        }

    } catch (err) {
        console.log(err)
    }

    //After command remove all clone traces
    if (actualExecutorId) {
        message.guild.member.id = actualExecutorId;
        message.author.id = actualExecutorId;
    };
};
