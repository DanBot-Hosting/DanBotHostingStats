const Discord = require('discord.js')

exports.run = async (client, message, args) => {
            if(message.guild.channels.cache.find(ch => ch.name.includes(message.author.tag.toString().toLowerCase().replace(' ', '-'))))
                return message.channel.send(`💡 | You **already** have opened **ticket**!`)
        
            let channel = await message.guild.channels.create("🎫╏" + message.author.tag + "-ticket", "text")
    
            .catch((err) => {
                console.log(err)
            })
    
            let category = message.guild.channels.cache.find(c => c.id === "741082659610034257" && c.type === "category");
            let categorybackup = message.guild.channels.cache.find(c => c.id === "738538742603841650" && c.type === "category");
            let categorybackup2 = message.guild.channels.cache.find(c => c.id === "864581561830604810" && c.type === "category");
            if(!category || !categorybackup || !categorybackup2) return;
        
            await channel.setParent(category.id).catch(channel.setParent(categorybackup.id).catch(channel.setParent(categorybackup2.id).catch(console.error)));  
    
            setTimeout(() => {
    
                channel.updateOverwrite(message.guild.roles.everyone, {
                    SEND_MESSAGES: false,
                    VIEW_CHANNEL: false
                });
        
                channel.updateOverwrite(message.author.id, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true
                });
        
                channel.updateOverwrite('748117822370086932', {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true
                })
                
            }, 1000);
    
            message.channel.send(`🎫 | **You've** opened a **ticket**, you can **check** it out **here**: ${channel}.`)
        
            if (userData.get(message.author.id) == null) {

                const embed = new Discord.MessageEmbed()
                .setAuthor(`${client.user.username} | Tickets`, client.user.avatarURL())
                .setDescription(`> You **succesfully** made a **ticket**, please **do not** ping staff it will not fix **your problem** faster.`)
                .addField(`📡 | Account Info`, `> This **account** is not linked with a **console** account.`)
                .setColor(message.guild.me.displayHexColor)
                .setTimestamp()
                channel.send(`${message.author}`, embed)

            } else {

                const embed = new Discord.MessageEmbed()
                .setAuthor(`${client.user.username} | Tickets`, client.user.avatarURL())
                .setDescription(`> You **succesfully** made a **ticket**, please **do not** ping staff it will not fix **your problem** faster.`)
                .addField(`📡 | Account Info`, `> **Username:** ${userData.fetch(message.author.id + ".username")}\n> **Email:** ||${userData.fetch(message.author.id + ".email")}||\n> **Link Date:** ${userData.fetch(message.author.id + ".linkDate")}\n> **Link Time:** ${userData.fetch(message.author.id + ".linkTime")}`)
                .setColor(message.guild.me.displayHexColor)
                .setTimestamp()
                channel.send(`${message.author}`, embed)

            }
}
