exports.run = async(client, message) => {
    
  //Sends message while the json's are being cached
  let embed = new Discord.RichEmbed()
  .setColor(`RANDOM`)
  .addField(`__**Please wait...**__`, `Loading all node's stats! (If this takes longer than 5seconds. This command is broken)`, true);
  let msg = await message.channel.send(embed)

  //Edits the message to display the data
      embed.fields.pop()
          embed.addField("\u200b", "__**[Node 1 - Discord Bots](https://danbot.host/Node1)**__ \n**CPU LOAD**: " + nodeData.fetch("Node1.cpuload") + "% \n**RAM (USED/TOTAL)**: " + nodeData.fetch("Node1.memused") + " / " + nodeData.fetch("Node1.memtotal") + " \n**STORAGE (USED/TOTAL)**: " + nodeData.fetch("Node1.diskused") + " / " + nodeData.fetch("Node1.disktotal") + " \n**UPTIME**: " + nodeData.fetch("Node1.osuptime") + "\n**Servers:** **Total**: " + nodeData.fetch("Node1.dockercontainers") + ", **Running**: " + nodeData.fetch("Node1.dockercontainersrunning") + ", **Stopped**: " + nodeData.fetch("Node1.dockercontainersstopped"))
          embed.addField('\u200b', '\u200b')
          embed.addField("\u200b", "__**[Node 2 - Discord Bots](https://danbot.host/Node2)**__ \n**CPU LOAD**: " + nodeData.fetch("Node2.cpuload") + "% \n**RAM (USED/TOTAL)**: " + nodeData.fetch("Node2.memused") + " / " + nodeData.fetch("Node2.memtotal") + " \n**STORAGE (USED/TOTAL)**: " + nodeData.fetch("Node2.diskused") + " / " + nodeData.fetch("Node2.disktotal") + " \n**UPTIME**: " + nodeData.fetch("Node2.osuptime") + "\n**Servers**: **Total**: " + nodeData.fetch("Node2.dockercontainers") + ", **Running**: " + nodeData.fetch("Node2.dockercontainersrunning") + ", **Stopped**: " + nodeData.fetch("Node2.dockercontainersstopped"))
          embed.addField('\u200b', '\u200b')
          embed.addField("\u200b", "__**[Node 3 - Gaming](https://danbot.host/Node3)**__ \n**CPU LOAD**: " + nodeData.fetch("Node3.cpuload") + "% \n**RAM (USED/TOTAL)**: " + nodeData.fetch("Node3.memused") + " / " + nodeData.fetch("Node3.memtotal") + " \n**STORAGE (USED/TOTAL)**: " + nodeData.fetch("Node3.diskused") + " / " + nodeData.fetch("Node3.disktotal") + " \n**UPTIME**: " + nodeData.fetch("Node3.osuptime") + "\n**Servers**: **Total**: " + nodeData.fetch("Node3.dockercontainers") + ", **Running**: " + nodeData.fetch("Node3.dockercontainersrunning") + ", **Stopped**: " + nodeData.fetch("Node3.dockercontainersstopped"))
          embed.addField('\u200b', '\u200b')
          embed.addField("\u200b", "__**[Node 4 - Test](https://danbot.host/Node4)**__ \n**CPU LOAD**: " + nodeData.fetch("Node4.cpuload") + "% \n**RAM (USED/TOTAL)**: " + nodeData.fetch("Node4.memused") + " / " + nodeData.fetch("Node4.memtotal") + " \n**STORAGE (USED/TOTAL)**: " + nodeData.fetch("Node4.diskused") + " / " + nodeData.fetch("Node4.disktotal") + " \n**UPTIME**: " + nodeData.fetch("Node4.osuptime") + "\n**Servers**: **Total**: " + nodeData.fetch("Node4.dockercontainers") + ", **Running**: " + nodeData.fetch("Node4.dockercontainersrunning") + ", **Stopped**: " + nodeData.fetch("Node4.dockercontainersstopped"))
          embed.setDescription('Want to view more stats live? [Click Here!](https://danbot.host/stats)')
      msg.edit(embed);
};