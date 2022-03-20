exports.run = async(client, message, args) => {

    // Lets only staff use the command [useless - never uncomment - i will find you if you do]
    // if (!message.member.roles.cache.get('898041751099539497')) return;

    if (args[0] != null) {

        if (args[0].toLowerCase() == 'dump' && message.member.roles.cache.get('898041743566594049') != null) {
            let file = new Discord.MessageAttachment(Buffer.from(JSON.stringify(Array.from(messageSnipes)), "utf8"), "Snipes-Dump.json");
            message.author.send(file);
            message.channel.send('Check your dms.');
            return;
        }

        if (args[0].toLowerCase() == 'purge' && (message.member.roles.cache.get('898041751099539497') != null || message.member.roles.cache.get('898041743566594049') != null)) {

            /**
             *  -- Can only be used by staff --
             * Usage: DBH!snipe purge [user | *] <reason>
             * if user is not specified the bot will purge all the logs for that current channel
             * if you pass * as user, it will completely dumb the logs.
             */

            let reason = args.slice(1);

            if (reason.length == 0) {
                message.channel.send({
                    embed: new Discord.MessageEmbed().setTitle('Snipe Dump')
                        .setDescription(" \*  -- Can only be used by staff --\n\* Usage: DBH!snipe purge [user | \*] <reason>\n\* if user is not specified the bot will purge all the logs for that current channel\n\* if you pass \* as user, it will completely dumb the logs.")
                        .setColor('BLUE')
                })
                return;
            }

            // Target Check
            let target;
            if (reason[0] == '*' || message.guild.members.cache.get((reason[0].match(/[0-9]{18}/) == null ? reason[0] : reason[0].match(/[0-9]{18}/)[0]))) {
                target = (!reason[0].match(/[0-9]{18}/) || reason[0].match(/[0-9]{18}/).length == 0) ? reason[0] : reason[0].match(/[0-9]{18}/)[0];
                reason.shift();
            }

            if (reason.length == 0) {
                message.channel.send('You are required to provide a reason when purging snipe logs.')
                return;
            }
            let file;

            if (target != '*') {
                file = new Discord.MessageAttachment(Buffer.from(JSON.stringify(messageSnipes.get(message.channel.id).filter(x => x.member == target)), "utf8"), "Snipe-Logs.json");
                messageSnipes.set(message.channel.id, messageSnipes.get(message.channel.id).filter(x => x.member != target));
            } else if (message.member.roles.cache.get('898041743566594049') != null && message.member.roles.cache.get('898041743566594049') != null) {
                file = new Discord.MessageAttachment(Buffer.from(JSON.stringify(Array.from(messageSnipes)), "utf8"), "Snipe-Logs.json");

                messageSnipes.clear();
            } else {
                message.channel.send("You don't have permission to do this.");
                return;
            }

            client.channels.cache.get('848489049203146762').send(`${message.member} purged ${target == '*'? `all messages`: `${target}'s messages in ${message.channel}`} for the reason: ${reason}.`, file)
            message.channel.send('purged.')
            return;
        }
    }

    let embed3 = new Discord.MessageEmbed().setDescription(`Theres nothing to snipe`)

    let snipe = messageSnipes.get(message.channel.id)

    if (snipe == null) return message.channel.send(embed3)

    snipe = [...snipe.values()]

    //Reversing the array
    snipe.reverse();

    // getting the number
    let number = 0;

    if (args[0] == null) number = 0;
    else number = (parseInt(args[0]) - 1);

    //setting a min and max
    if (number >= snipe.length) number = snipe.length - 1;
    if (number < 0) number = 0;

    // getting the message
    let snipedMessage = snipe[number];

    // console.log("SNIPE", snipedMessage, snipe, number);

    //sending the message
    const embed = new Discord.MessageEmbed()
        .setTitle(`Message ${snipedMessage.action} by ${snipedMessage.member.user.tag}`)
        .setDescription("`" + snipedMessage.message + "`")
        .setImage(snipedMessage.image)
        .setFooter(`${number + 1}/${snipe.length}`).setTimestamp(snipedMessage.timestamp)
        .setColor("GREEN");
    message.channel.send(embed);
}
