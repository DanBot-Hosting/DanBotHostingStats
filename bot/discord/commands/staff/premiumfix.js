const premiumNodes = [21, 26, 13];

exports.run = async(client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id === "898041751099539497")) return;

    if (!args[1]) {
        return message.channel.send('Please provide a user id!');

    } else {
        const replyMsg = await message.channel.send('Staring calculation...');

        let selectedUser = message.mentions.users.first() || message.guild.members.fetch(args[1]);
        selectedUser = await selectedUser;

        const response = await axios({
            url: "https://panel.danbot.host" + "/api/application/users/" + userData.get(selectedUser.id).consoleID + "?include=servers",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        });

        const preoutput = response.data.attributes.relationships.servers.data;
        
        let actualPremiumServersUsed = 0;
        for (let index = 0; index < preoutput.length; index++) {
            if (premiumNodes.includes(preoutput[index].attributes.node)) ++actualPremiumServersUsed;
        };

        const userPremData = userPrem.get(selectedUser.id);

        const storedPremiumServersUsed = userPremData.used;

        console.log({actualPremiumServersUsed, storedPremiumServersUsed, userPremData, selectedUser})
        if(actualPremiumServersUsed != storedPremiumServersUsed) {
            userPrem.set(selectedUser.id, { used: actualPremiumServersUsed, donated: userPremData.donated });
            replyMsg.edit(`${selectedUser.tag}'s premium server count has been fixed!`)
        } else {
            replyMsg.edit(`${selectedUser.tag} has the correct premium server count!`)
        };        
    };
};
