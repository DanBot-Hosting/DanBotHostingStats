exports.run = async(client, message) => {
    
  //Sends message while the json's are being cached
  let embed = new Discord.RichEmbed()
  .setColor(`RANDOM`)
  .addField(`__**Please wait...**__`, `Loading all node's stats!`, true);
  let msg = await message.channel.send(embed)

  //Reads the saved jsons for each node
//Data for node 1
var N1 = fs.readFileSync('./data/0286b2ad-dc80-4b5c-a0de-b81945b010e8.json', 'utf8');
var Node1Data = JSON.parse(N1);

//Data for node 2
var N2 = fs.readFileSync('./data/2e3f071a-af2b-4dc9-be5a-7ce72590a181.json', 'utf8');
var Node2Data = JSON.parse(N2);

//Data for node 3
var N3 = fs.readFileSync('./data/e5406f6d-a9a6-44fa-9dde-429ffc1bf1d7.json', 'utf8');
var Node3Data = JSON.parse(N3);

//Data for Main Dedi
var MainD = fs.readFileSync('./data/pve.json', 'utf8');
var Node4Data = JSON.parse(MainD);

//Data for node 5
var N5 = fs.readFileSync('./data/Server-01.json', 'utf8');
var Node5Data = JSON.parse(N5);

  //Edits the message to display the data
      embed.fields.pop()
          embed.addField("\u200b", "__**[Node 1 - Discord Bots](https://stats.danbot.xyz/Node1)**__ \n**CPU LOAD**: " + Node1Data.cpuload + "% \n**RAM (USED/TOTAL)**: " + Node1Data.memused + " / " + Node1Data.memtotal + " \n**STORAGE (USED/TOTAL)**: " + Node1Data.diskused + " / " + Node1Data.disktotal + " \n**UPTIME**: " + Node1Data.osuptime)
          embed.addField('\u200b', '\u200b')
          embed.addField("\u200b", "__**[Node 2 - Discord Bots](https://stats.danbot.xyz/Node2)**__ \n**CPU LOAD**: " + Node2Data.cpuload + "% \n**RAM (USED/TOTAL)**: " + Node2Data.memused + " / " + Node2Data.memtotal + " \n**STORAGE (USED/TOTAL)**: " + Node2Data.diskused + " / " + Node2Data.disktotal + " \n**UPTIME**: " + Node2Data.osuptime)
          embed.addField('\u200b', '\u200b')
          embed.addField("\u200b", "__**[Node 3 - Gaming](https://stats.danbot.xyz/Node3)**__ \n**CPU LOAD**: " + Node3Data.cpuload + "% \n**RAM (USED/TOTAL)**: " + Node3Data.memused + " / " + Node3Data.memtotal + " \n**STORAGE (USED/TOTAL)**: " + Node3Data.diskused + " / " + Node3Data.disktotal + " \n**UPTIME**: " + Node3Data.osuptime)
          embed.addField('\u200b', '\u200b')
          embed.addField("\u200b", "__**[Main Dedi](https://stats.danbot.xyz/Main)**__ \n**CPU LOAD**: " + Node4Data.cpuload + "% \n**RAM (USED/TOTAL)**: " + Node4Data.memused + " / " + Node4Data.memtotal + " \n**STORAGE (USED/TOTAL)**: " + Node4Data.diskused + " / " + Node4Data.disktotal + " \n**UPTIME**: " + Node4Data.osuptime)
          embed.addField('\u200b', '\u200b')
          embed.addField("\u200b", "__**[Node 4 - Private](https://stats.danbot.xyz/Node4)**__ \n**CPU LOAD**: " + Node5Data.cpuload + "% \n**RAM (USED/TOTAL)**: " + Node5Data.memused + " / " + Node5Data.memtotal + " \n**STORAGE (USED/TOTAL)**: " + Node5Data.diskused + " / " + Node5Data.disktotal + " \n**UPTIME**: " + Node5Data.osuptime)
          embed.setDescription('Want to view more stats live? [Click Here!](https://stats.danbot.xyz/)')
      msg.edit(embed);
};