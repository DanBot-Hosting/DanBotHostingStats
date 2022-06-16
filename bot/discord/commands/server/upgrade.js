exports.run = async(client, message, args) => {
    /*
    let user = userPrem.fetch(message.author.id);

    let boosted;
    axios({
        url: "http://admin.danbot.host:1029",
        method: 'GET',
        headers: {
            "password": config.externalPassword
        },
    }).then(response => {
        boosted = response.data[message.author.id];
    }).catch((e) => {
        // console.log(e);
    }).then(() => {

        const serverName = message.content.split(' ').slice(3).join(' ') || "change me! (Settings -> SERVER NAME)";
        let consoleID = userData.get(message.author.id);

        if (consoleID == null) {
            message.channel.send("Oh no, Seems like you do not have an account linked to your discord ID.\n" +
                "If you have not made an account yet please check out `" +
                config.DiscordBot.Prefix + "user new` to create an account \nIf you already have an account link it using `" +
                config.DiscordBot.Prefix + "user link`");
            return;
        }

        let allowed = (message.member.roles.cache.get('710208090741539006') != null) ? (Math.floor(user.donated / config.node7.price) + (boosted != null ? Math.floor(boosted * 2.5) : 2)) : Math.floor(user.donated / config.node7.price);

        if (allowed === 0) {
            message.channel.send("You're not a premium user, to get access to premium you can either boost us for 2 **Premium Servers**, or buy a server (1server/$1)")
            return;
        }

        if ((allowed - user.used) <= 0) {
            message.channel.send("You are at your premium server limit")
            return;
        }

        if (!args[1]) {
            message.channel.send('Usage: DBH!server upgrade serverid amount')
        } else {

        }
    })
     */
}
