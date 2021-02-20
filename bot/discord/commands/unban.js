const Discord = require("discord.js")
const prefixtouse = config.prefix;


module.exports.run = async(client, message, args) => {

    const usage = new Discord.MessageEmbed()
    .setColor(0x00A2E8)
    .setTitle("Command: " + prefixtouse + "unban")
    .addField("Usage", prefixtouse + "unban <user id>")
    .addField("Example", prefixtouse + "unban 696969696969696969 ")
    .setDescription("Description: " + "Unban user");
  
      if (!args[0])
        return message.channel.send(
         usage
        );
      
        let bannedMemberInfo = await message.guild.fetchBans()

        let bannedMember;
        bannedMember = bannedMemberInfo.find(b => b.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || bannedMemberInfo.get(args[0]) || bannedMemberInfo.find(bm => bm.user.tag.toLowerCase() === args[0].toLocaleLowerCase());
        if (!bannedMember) return message.channel.send("**Please Provide A Valid Username, Tag Or ID Or The User Is Not Banned!**")

        let reason = args.slice(1).join(" ")

        if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send("**I Don't Have Permissions To Unban Someone! - [BAN_MEMBERS]**")
        try {
            if (reason) {
                message.guild.members.unban(bannedMember.user.id, reason)
                var sembed = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`${bannedMember.user.tag} has been unbanned for: \n**${reason}**`)
                message.channel.send(sembed)
            } else {
                message.guild.members.unban(bannedMember.user.id, reason)
                var sembed2 = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`**${bannedMember.user.tag} has been unbanned**`)
                message.channel.send(sembed2)
            }
        } catch {
            return;
        }

        const embed = new Discord.MessageEmbed()
        .setColor(0x00A2E8)
        .addField("Moderator", message.author.tag, true)
        .addField("Unbanned", args[0], true)
        .setFooter("Time used: " + message.createdAt.toDateString())
      return client.channels.cache.get(config.DiscordBot.modLogs).send({
        embed
      });
    
    }
