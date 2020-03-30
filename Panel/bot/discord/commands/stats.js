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
  var N3 = fs.readFileSync('./data/6fc3e9bf-24a8-47cd-99d3-fa159e05a9f4.json', 'utf8');
  var Node3Data = JSON.parse(N3);

  //Data for node 4
  var N4 = fs.readFileSync('./data/15ffcdd0-a021-4ded-977d-284d777330a0.json', 'utf8');
  var Node4Data = JSON.parse(N4);

    //Edits the message to display the data
        embed.fields.pop()
            embed.addField("\u200b", "__**[Node 1](https://stats.danbot.xyz/Node1)**__ \n**CPU LOAD**: " + Node1Data.cpuload + "% \n**RAM (USED/TOTAL)**: " + Node1Data.memused + " / " + Node1Data.memtotal + " \n**STORAGE (USED/TOTAL)**: " + Node1Data.diskused + " / " + Node1Data.disktotal + " \n**UPTIME**: " + Node1Data.osuptime)
            embed.addField('\u200b', '\u200b')
            embed.addField("\u200b", "__**[Node 2](https://stats.danbot.xyz/Node2)**__ \n**CPU LOAD**: " + Node2Data.cpuload + "% \n**RAM (USED/TOTAL)**: " + Node2Data.memused + " / " + Node2Data.memtotal + " \n**STORAGE (USED/TOTAL)**: " + Node2Data.diskused + " / " + Node2Data.disktotal + " \n**UPTIME**: " + Node2Data.osuptime)
            embed.addField('\u200b', '\u200b')
            embed.addField("\u200b", "__**[Node 3](https://stats.danbot.xyz/Node3)**__ \n**CPU LOAD**: " + Node3Data.cpuload + "% \n**RAM (USED/TOTAL)**: " + Node3Data.memused + " / " + Node3Data.memtotal + " \n**STORAGE (USED/TOTAL)**: " + Node3Data.diskused + " / " + Node3Data.disktotal + " \n**UPTIME**: " + Node3Data.osuptime)
            embed.addField('\u200b', '\u200b')
            embed.addField("\u200b", "__**[Node 4](https://stats.danbot.xyz/Node4)**__ \n**CPU LOAD**: " + Node4Data.cpuload + "% \n**RAM (USED/TOTAL)**: " + Node4Data.memused + " / " + Node4Data.memtotal + " \n**STORAGE (USED/TOTAL)**: " + Node4Data.diskused + " / " + Node4Data.disktotal + " \n**UPTIME**: " + Node4Data.osuptime)
            embed.setDescription('Want to view more stats live? [Click Here!](https://stats.danbot.xyz/)')
        msg.edit(embed);
};