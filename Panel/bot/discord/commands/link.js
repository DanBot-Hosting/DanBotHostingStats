var path = require("path")
var fs = require("fs")
const moment = require("moment");
const axios = require('axios');
exports.run = async (client, message) => {
    const args = message.content.split(' ').slice(1).join(' ');

    if (userData.get(message.author.id) == null) {

        const server = message.guild

        let channel = await server.createChannel(message.author.tag, "text", [{
                type: 'role',
                id: message.guild.id,
                deny: 0x400
            },
            {
                type: 'user',
                id: message.author.id,
                deny: 1024
            }
        ]).catch(console.error);
        message.reply(`Please check <#${channel.id}> to link your account.`)

        let category = server.channels.find(c => c.id == "738539016688894024" && c.type == "category");
        if (!category) throw new Error("Category channel does not exist");

        await channel.setParent(category.id);

        channel.overwritePermissions(message.author, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true
        })



        let msg = await channel.send(message.author, {
            embed: new Discord.RichEmbed()
                .setColor(0x36393e)
                .setDescription("Please enter your console email address")
                .setFooter("You can type 'cancel' to cancel the request \n**This will take a few seconds to find your account.**")
        })

        const collector = new Discord.MessageCollector(channel, m => m.author.id === message.author.id, { time: 60000 });
        collector.on('collect', message => {
            //console.log(message.content)
        
        if (message.content === 'cancel') {
            return msg.edit("Request to link your account canceled.", null).then(channel.delete())
        }

        //Page 1
        axios({
            url: config.Pterodactyl.hosturl + "/api/application/users",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response1 => {
            //console.log(consoleUserPage1)

        //Page 2
        axios({
            url: config.Pterodactyl.hosturl + "/api/application/users?page=2",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response2 => {
            //console.log(consoleUserPage2)
        
        //Page 3
        axios({
            url: config.Pterodactyl.hosturl + "/api/application/users?page=3",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response3 => {
            //console.log(consoleUserPage3)
        
        //Page 4
        axios({
            url: config.Pterodactyl.hosturl + "/api/application/users?page=4",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response4 => {
            //console.log(consoleUserPage4)
        
        //Page 5
        axios({
            url: config.Pterodactyl.hosturl + "/api/application/users?page=5",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response5 => {
            //console.log(consoleUserPage5)
        
        //Page 6
        axios({
            url: config.Pterodactyl.hosturl + "/api/application/users?page=6",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response6 => {
            //console.log(consoleUserPage6)
        
        //Page 7
        axios({
            url: config.Pterodactyl.hosturl + "/api/application/users?page=7",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response7 => {
            //console.log(consoleUserPage7)

        //Page 8
        axios({
            url: config.Pterodactyl.hosturl + "/api/application/users?page=8",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response8 => {
            //console.log(consoleUserPage8)

        //Page 9
        axios({
            url: config.Pterodactyl.hosturl + "/api/application/users?page=9",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response9 => {
            //console.log(consoleUserPage9)

        //Page 10
        axios({
            url: config.Pterodactyl.hosturl + "/api/application/users?page=10",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response10 => {
            //console.log(consoleUserPage10)

        //Page 11
        axios({
            url: config.Pterodactyl.hosturl + "/api/application/users?page=11",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response11 => {
            //console.log(consoleUserPage11)
            const bigArr = [...response1.data.data, ...response2.data.data, ...response3.data.data, ...response4.data.data, ...response5.data.data, ...response6.data.data, ...response7.data.data, ...response8.data.data, ...response9.data.data, ...response10.data.data, ...response11.data.data]
            const consoleUser = bigArr.find(usr => usr.attributes ? usr.attributes.email == message.content : false);

        if (!consoleUser) {
            channel.send('I can\'t find a user with that account!')
        } else {
            //consoleUser1 = consoleUser[0];
            const timestamp = `${moment().format("HH:mm:ss")}`;
            const datestamp = `${moment().format("YYYY-MM-DD")}`;
            userData.set(`${message.author.id}`, {
                discordID: message.author.id,
                consoleID: consoleUser.attributes.id,
                email: consoleUser.attributes.email,
                username: consoleUser.attributes.username,
                linkTime: timestamp,
                linkDate: datestamp
            });

            let embedstaff = new Discord.RichEmbed()
            .setColor('Green')
            .addField('__**Linked Discord account:**__', message.author.id)
            .addField('__**Linked Console account email:**__', consoleUser.attributes.email)
            .addField('__**Linked At: (TIME / DATE)**__', timestamp + " / " + datestamp)
            .addField('__**Linked Console username:**__', consoleUser.attributes.username)
            .addField('__**Linked Console ID:**__', consoleUser.attributes.id)

            channel.send("Account linked! You can now create server's and use other features on this bot!").then(
                client.channels.get(config.DiscordBot.oLogs).send(`<@${message.author.id}> linked their account. Heres some info: `, embedstaff),
                setTimeout(() => {
                    channel.delete();
                }, 5000)
            );
            
        };
    })})})})})})})})})})})
});
} else {
    let embed = new Discord.RichEmbed()
            .setColor(`GREEN`)
            .addField(`__**Username**__`, userData.fetch(message.author.id + ".username"))
            .addField(`__**Linked Date (DD/MM/YY)**__`, userData.fetch(message.author.id + ".linkDate"))
            .addField(`__**Linked Time**__`, userData.fetch(message.author.id + ".linkTime"))
    message.channel.send("This account is linked!", embed)
}
    
}