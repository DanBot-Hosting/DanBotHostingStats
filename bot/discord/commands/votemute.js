const ms = require('ms');
const Discord = require('discord.js');
const db = require('quick.db');
const mutesData = new db.table("muteData");
let mutes = {};

exports.run = async(client, message, args) => {
  let modlog = message.guild.channels.cache.find(channel => channel.id === config.DiscordBot.modLogs);
  if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.reply('Sorry, i dont have the perms to do this cmd i need MANAGE_ROLES. :x:');
  if (args.length < 1) {
      message.channel.send('', {
          embed: new Discord.MessageEmbed().setColor(0x00A2E8)
              .setDescription(`Correct usage ${config.DiscordBot.Prefix}votemute <@user|userID> [Time : 5m] [Reason : unspecified]`).setFooter('<required> [optional]')
      })
      return;
  }
  let target = message.guild.members.cache.get(args[0].match(/[0-9]{18}/).length == 0 ? args[0] : args[0].match(/[0-9]{18}/)[0])
  let reason = args.slice(2).join(' ') || `unspecified`;
  let time = ms(args[1]) || 300000;

  if (target == null) return message.reply("please specify a valid user.");
  if (time > 7200000) time = 7200000; // If the time value is over 2 hours
  if (time < 5000) time = 5000; // If the time value is less than 5 seconds

  const yes = '👍';
  const filter = (reaction, user) => reaction.emoji.name === yes;
  const scm = await message.channel.send("Mute " + target.username + "? 10👍 reactions required to get this user muted!");

  scm.react(yes);

  const collected = await scm.awaitReactions(filter, { time: 120000 }); // Starting votemute
  const agree = collected.get(yes) || { count: 1 }; // Defining amount reactions
  const yes_count = agree.count - 1 ; // Removing bot's count
    
  if (yes_count < 10) return message.channel.send(":x: ***Voting ended with " + yes_count + yes + " reactions. Mentioned user won't be muted!***"); // Voting failed

  message.channel.send(":white_check_mark: ***Voting ended with " + yes_count + yes + " reactions. The user has been successfully muted for " + ms(time, {
    long: true
  }) + "!***"); // Voting succeeded
      
  mutesData.set(target.id, {
    mutedAt: Date.now(),
    expiresAt: Date.now() + time
  }); // Mute data
      
  await target.roles.add(config.DiscordBot.roles.mute) // Giving a mute role
      
  if (modlog != null) {
    modlog.send('', {
      embed: new Discord.MessageEmbed()
      .setColor(0x00A2E8)
      .setTitle("Action: Vote-Mute")
      .addField("Asked", message.author.tag + " (ID: " + message.author.id + ")")
      .addField("User", target.user.tag + " (ID: " + target.id + ")")
      .addField("Time", ms(time, {
        long: true
      }), true)
      .addField("Reason", reason, true)
      .addField("Reactions", yes_count)
      .setFooter("Time used:").setTimestamp()
    })
  } // Logging a succesful action
};
