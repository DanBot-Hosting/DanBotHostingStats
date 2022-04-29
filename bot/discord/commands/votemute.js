const ms = require('ms');
const Discord = require('discord.js');
const mutesData = new require('quick.db').table("muteData");

exports.run = async(client, message, args) => {
  let modlog = message.guild.channels.cache.find(channel => channel.id === config.DiscordBot.modLogs);
  if (!message.member.roles.cache.find(r => r.id === "898041754564046869")) return message.reply("Sorry, but it looks like you're too much of a boomer to run this command.");
  if (args.length < 2) return message.channel.send('', { embed: new Discord.MessageEmbed().setColor(0x00A2E8).setDescription(`Correct usage ${config.DiscordBot.Prefix}votemute <@user|userID> [Time : 5m] [Reason : unspecified]`).setFooter('<required> [optional]')});
  const allowed_channels = ["898041849783148585", "898041865616650240"];
  if (!allowed_channels.includes(message.channel.id)) return; // Only lounge and dono lounge
  let target = message.guild.members.cache.get(args[0].match(/[0-9]{18}/).length == 0 ? args[0] : args[0].match(/[0-9]{18}/)[0])
  let reason = args.slice(2).join(' ');
  let time = ms(args[1]) || 300000;
  
  if (!target) return message.reply("Please specify a valid user.");
  if (!reason) return message.reply("Please specify a valid reason.");
  if (time > 7200000) time = 7200000; // If the time value is over 2 hours
  if (time < 5000) time = 5000; // If the time value is less than 5 seconds

  const yes = '👍';
  const filter = (reaction, user) => reaction.emoji.name === yes && !user.bot;
  const scm = await message.channel.send(`Mute ${target.username}? 10${yes} reactions required to get this user muted!`);

  scm.react(yes);

  const collected = await scm.awaitReactions(filter, { time: 120000 }); // Starting votemute
  const agree = collected.get(yes) || { count: 1 }; // Defining amount reactions
    
  if (agree.count < 10) return message.channel.send(`:x: ***Voting ended with ${agree.count} ${yes} reactions. Mentioned user won't be muted!***`); // Voting failed

  message.channel.send(`:white_check_mark: ***Voting ended with  ${agree.count} ${yes} reactions. The user has been successfully muted for ${ms(time, { long: true })}!***`); // Voting succeeded
      
  mutesData.set(target.id, {
    mutedAt: Date.now(),
    expiresAt: Date.now() + time
  }); // Mute data
      
  await target.roles.add(config.DiscordBot.roles.mute) // Giving a mute role
      
  if (!modlog) return;
  modlog.send('', {
    embed: new Discord.MessageEmbed()
    .setColor(0x00A2E8)
    .setTitle("Action: Vote-Mute")
    .addField("Asked", `${message.author.tag} (ID: ${message.author.id})`)
    .addField("User", `${target.user.tag} (ID: ${target.id})`)
    .addField("Time", ms(time, {
      long: true
    }), true)
    .addField("Reason", reason, true)
    .addField("Reactions", agree.count)
    .setFooter("Time used:").setTimestamp()
  }) // Logging a succesful action
};
