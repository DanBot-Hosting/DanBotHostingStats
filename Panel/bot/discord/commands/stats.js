exports.run = async (client, message) => {

  //Sends message while the json's are being cached
  let embed = new Discord.RichEmbed()
    .setColor(`RANDOM`)
    .addField(`__**Please wait...**__`, `Loading all node's stats! (If this takes longer than 5seconds. This command is broken)`, true);
  let msg = await message.channel.send(embed)

  //Data for node 1
  var N1 = fs.readFileSync('./data/Node1.json', 'utf8');
  var Node1Data = JSON.parse(N1);

  //Data for node 2
  var N2 = fs.readFileSync('./data/Node2.json', 'utf8');
  var Node2Data = JSON.parse(N2);

  //Data for node 3
  var N3 = fs.readFileSync('./data/vmi450443.contaboserver.net.json', 'utf8');
  var Node3Data = JSON.parse(N3);

  //Edits the message to display the data
  embed.fields.pop()
  embed.addField("\u200b", "__**[Node 1 - Discord Bots](https://danbot.host/Node1)**__ \n**CPU LOAD**: " + Node1Data.cpuload + "% \n**RAM (USED/TOTAL)**: " + Node1Data.memused + " / " + Node1Data.memtotal + " \n**STORAGE (USED/TOTAL)**: " + Node1Data.diskused + " / " + Node1Data.disktotal + " \n**UPTIME**: " + Node1Data.osuptime)
  embed.addField('\u200b', '\u200b')
  embed.addField("\u200b", "__**[Node 2 - Discord Bots](https://danbot.host/Node2)**__ \n**CPU LOAD**: " + Node2Data.cpuload + "% \n**RAM (USED/TOTAL)**: " + Node2Data.memused + " / " + Node2Data.memtotal + " \n**STORAGE (USED/TOTAL)**: " + Node2Data.diskused + " / " + Node2Data.disktotal + " \n**UPTIME**: " + Node2Data.osuptime)
  embed.addField('\u200b', '\u200b')
  embed.addField("\u200b", "__**[Node 3 - Gaming](https://danbot.host/Node3)**__ \n**CPU LOAD**: " + Node3Data.cpuload + "% \n**RAM (USED/TOTAL)**: " + Node3Data.memused + " / " + Node3Data.memtotal + " \n**STORAGE (USED/TOTAL)**: " + Node3Data.diskused + " / " + Node3Data.disktotal + " \n**UPTIME**: " + Node3Data.osuptime)
  embed.setDescription('Want to view more stats live? [Click Here!](https://danbot.host/stats)')
  msg.edit(embed);
};