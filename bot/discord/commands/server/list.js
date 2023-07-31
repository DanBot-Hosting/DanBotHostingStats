const axios = require('axios')
exports.run = async(client, message, args) => {
        
    try {
        let userAccount = userData.get(message.author.id);

        if (userAccount == null) {
            message.channel.send("Oh no, Seems like you do not have an account linked to your discord ID.\n" +
                "If you have not made an account yet please check out `" +
                config.DiscordBot.Prefix + "user new` to create an account \nIf you already have an account link it using `" +
                config.DiscordBot.Prefix + "user link`");
            return;
        };

        const loadingMsg = await message.channel.send('Loading servers...');

        //List servers
        var arr = [];
        let userID = message.author.id;

        if (message.member.roles.cache.find(r => r.id === "898041747597295667")) userID = args[1] || message.author.id; // Allow devs to lookup a users server list;

        axios({
            url: "https://panel.danbot.host" + "/api/application/users/" + userAccount.consoleID + "?include=servers",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response => {

            const preoutput = response.data.attributes.relationships.servers.data;
            arr.push(...preoutput)

            setTimeout(async() => {

                setTimeout(() => {                        
                    const DonoNodes = [34, 31, 33, 35];
                    const clean = arr.map(Server => {
                      if (DonoNodes.includes(Server.attributes.node)) {
                        return "[PREMIUM] Server Name: `" + Server.attributes.name + "`, Server ID: `" + Server.attributes.identifier + "`\n";
                      } else {
                        return "Server Name: `" + Server.attributes.name + "`, Server ID: `" + Server.attributes.identifier + "`\n";
                      };
                    });

                    if (clean.length == 0) {
                        message.channel.send("You don't have any servers unfortunately.");
                    } else if (clean.length > 70) {
                        message.channel.send("You have way too many servers to display!");
                    } else if (clean.length > 20) {
                        const ServerListEmbed = new Discord.MessageEmbed();
                        ServerListEmbed.setDescription('Your server list is too long so here is a abstracted version!\nYou have a total of ' + arr.length + ' servers!');
                        ServerListEmbed.addField('__**Your Servers:**__', arr.map(e => "`" + e.attributes.identifier + "`"));
                        message.channel.send(ServerListEmbed);
                    } else { 
                        const ServerListEmbed = new Discord.MessageEmbed();
                        ServerListEmbed.setDescription('You have a total of ' + arr.length + ' servers.');
                        ServerListEmbed.addField('__**Your Servers:**__', clean);
                        message.channel.send(ServerListEmbed);
                    }; 

                    loadingMsg.delete();
                }, 500);
            }, 5000);
        });

    } catch (Error) {
        console.log(Error);
    };
}
