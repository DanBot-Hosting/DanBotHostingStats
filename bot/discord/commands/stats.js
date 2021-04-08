exports.run = async (client, message) => {

    function formatFileSize(bytes, decimalPoint) {
        if (bytes === 0) return '0 Bytes';
        let k = 1024,
            dm = decimalPoint || 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    //Sends message while the json's are being cached
    let embed = new Discord.MessageEmbed()
        .setColor(`RANDOM`)
        .addField(`__**Please wait...**__`, `Loading all node's stats! (If this takes longer than 5seconds. This command is broken)`, true);
    let msg = await message.channel.send(embed)

    //Edits the message to display the data
    embed.fields.pop()
    embed.addField("\u200b", "__**[Node 1 - Bots, Websites and Databases](https://danbot.host/Node1)**__ \n**CPU LOAD**: " + nodeData.fetch("Node1.cpuload") + "% \n**RAM (USED/TOTAL)**: " + nodeData.fetch("Node1.memused") + " / " + nodeData.fetch("Node1.memtotal") + " \n**STORAGE (USED/TOTAL)**: " + nodeData.fetch("Node1.diskused") + " / " + nodeData.fetch("Node1.disktotal") + " \n**UPTIME**: " + nodeData.fetch("Node1.osuptime") + "\n**Servers:** **Total**: " + nodeData.fetch("Node1.dockercontainers") + ", **Running**: " + nodeData.fetch("Node1.dockercontainersrunning") + ", **Stopped**: " + nodeData.fetch("Node1.dockercontainersstopped"))
    embed.addField('\u200b', '\u200b')
    embed.addField("\u200b", "__**[Node 2 - Bots, Websites and Databases](https://danbot.host/Node2)**__ \n**CPU LOAD**: " + nodeData.fetch("Node2.cpuload") + "% \n**RAM (USED/TOTAL)**: " + nodeData.fetch("Node2.memused") + " / " + nodeData.fetch("Node2.memtotal") + " \n**STORAGE (USED/TOTAL)**: " + nodeData.fetch("Node2.diskused") + " / " + nodeData.fetch("Node2.disktotal") + " \n**UPTIME**: " + nodeData.fetch("Node2.osuptime") + "\n**Servers**: **Total**: " + nodeData.fetch("Node2.dockercontainers") + ", **Running**: " + nodeData.fetch("Node2.dockercontainersrunning") + ", **Stopped**: " + nodeData.fetch("Node2.dockercontainersstopped"))
    embed.addField('\u200b', '\u200b')
    embed.addField("\u200b", "__**[Node 3 - Gaming](https://danbot.host/Node3)**__ \n**CPU LOAD**: " + nodeData.fetch("Node3.cpuload") + "% \n**RAM (USED/TOTAL)**: " + nodeData.fetch("Node3.memused") + " / " + nodeData.fetch("Node3.memtotal") + " \n**STORAGE (USED/TOTAL)**: " + nodeData.fetch("Node3.diskused") + " / " + nodeData.fetch("Node3.disktotal") + " \n**UPTIME**: " + nodeData.fetch("Node3.osuptime") + "\n**Servers**: **Total**: " + nodeData.fetch("Node3.dockercontainers") + ", **Running**: " + nodeData.fetch("Node3.dockercontainersrunning") + ", **Stopped**: " + nodeData.fetch("Node3.dockercontainersstopped"))
    embed.addField('\u200b', '\u200b')
    embed.addField("\u200b", "__**[Node 4 - Test](https://danbot.host/Node4)**__ \n**CPU LOAD**: " + nodeData.fetch("Node4.cpuload") + "% \n**RAM (USED/TOTAL)**: " + nodeData.fetch("Node4.memused") + " / " + nodeData.fetch("Node4.memtotal") + " \n**STORAGE (USED/TOTAL)**: " + nodeData.fetch("Node4.diskused") + " / " + nodeData.fetch("Node4.disktotal") + " \n**UPTIME**: " + nodeData.fetch("Node4.osuptime") + "\n**Servers**: **Total**: " + nodeData.fetch("Node4.dockercontainers") + ", **Running**: " + nodeData.fetch("Node4.dockercontainersrunning") + ", **Stopped**: " + nodeData.fetch("Node4.dockercontainersstopped"))
    embed.addField('\u200b', '\u200b')
    embed.addField("\u200b", "__**[Node 5 - Bots, Websites and Databases](https://danbot.host/Node5)**__ \n**CPU LOAD**: " + nodeData.fetch("Node5.cpuload") + "% \n**RAM (USED/TOTAL)**: " + nodeData.fetch("Node5.memused") + " / " + nodeData.fetch("Node5.memtotal") + " \n**STORAGE (USED/TOTAL)**: " + nodeData.fetch("Node5.diskused") + " / " + nodeData.fetch("Node5.disktotal") + " \n**UPTIME**: " + nodeData.fetch("Node5.osuptime") + "\n**Servers**: **Total**: " + nodeData.fetch("Node5.dockercontainers") + ", **Running**: " + nodeData.fetch("Node5.dockercontainersrunning") + ", **Stopped**: " + nodeData.fetch("Node5.dockercontainersstopped"))
    embed.addField('\u200b', '\u200b')
    embed.addField("\u200b", "__**[Node 6 - Bots, Websites and Databases](https://danbot.host/Node6)**__ \n**CPU LOAD**: " + nodeData.fetch("Node6.cpuload") + "% \n**RAM (USED/TOTAL)**: " + nodeData.fetch("Node6.memused") + " / " + nodeData.fetch("Node6.memtotal") + " \n**STORAGE (USED/TOTAL)**: " + nodeData.fetch("Node6.diskused") + " / " + nodeData.fetch("Node6.disktotal") + " \n**UPTIME**: " + nodeData.fetch("Node6.osuptime") + "\n**Servers**: **Total**: " + nodeData.fetch("Node6.dockercontainers") + ", **Running**: " + nodeData.fetch("Node6.dockercontainersrunning") + ", **Stopped**: " + nodeData.fetch("Node6.dockercontainersstopped"))
    embed.addField('\u200b', '\u200b')
    embed.addField("\u200b", "__**[Node 7 - Donator Node](https://danbot.host/Node7)**__ \n**CPU LOAD**: " + nodeData.fetch("Node7.cpuload") + "% \n**RAM (USED/TOTAL)**: " + nodeData.fetch("Node7.memused") + " / " + nodeData.fetch("Node7.memtotal") + " \n**STORAGE (USED/TOTAL)**: " + nodeData.fetch("Node7.diskused") + " / " + nodeData.fetch("Node7.disktotal") + " \n**UPTIME**: " + nodeData.fetch("Node7.osuptime") + "\n**Servers**: **Total**: " + nodeData.fetch("Node7.dockercontainers") + ", **Running**: " + nodeData.fetch("Node7.dockercontainersrunning") + ", **Stopped**: " + nodeData.fetch("Node7.dockercontainersstopped"))
    embed.addField('\u200b', '\u200b')
    embed.addField("\u200b", "__**[Node 8 - Gaming Node BETA](https://danbot.host/Node8)**__ \n**CPU LOAD**: " + nodeData.fetch("Node8.cpuload") + "% \n**RAM (USED/TOTAL)**: " + nodeData.fetch("Node8.memused") + " / " + nodeData.fetch("Node8.memtotal") + " \n**STORAGE (USED/TOTAL)**: " + nodeData.fetch("Node8.diskused") + " / " + nodeData.fetch("Node8.disktotal") + " \n**UPTIME**: " + nodeData.fetch("Node8.osuptime") + "\n**Servers**: **Total**: " + nodeData.fetch("Node8.dockercontainers") + ", **Running**: " + nodeData.fetch("Node8.dockercontainersrunning") + ", **Stopped**: " + nodeData.fetch("Node8.dockercontainersstopped"))
    embed.addField('\u200b', '\u200b')
    embed.addField("\u200b", "__**[Node 9 - Bots, Websites and Databases](https://danbot.host/Node9)**__ \n**CPU LOAD**: " + nodeData.fetch("Node9.cpuload") + "% \n**RAM (USED/TOTAL)**: " + nodeData.fetch("Node9.memused") + " / " + nodeData.fetch("Node9.memtotal") + " \n**STORAGE (USED/TOTAL)**: " + nodeData.fetch("Node9.diskused") + " / " + nodeData.fetch("Node9.disktotal") + " \n**UPTIME**: " + nodeData.fetch("Node9.osuptime") + "\n**Servers**: **Total**: " + nodeData.fetch("Node9.dockercontainers") + ", **Running**: " + nodeData.fetch("Node9.dockercontainersrunning") + ", **Stopped**: " + nodeData.fetch("Node9.dockercontainersstopped"))
    embed.addField('\u200b', '\u200b')
    embed.addField("\u200b", "__**[Node 10 - Bots, Websites and Databases](https://danbot.host/Node10)**__ \n**CPU LOAD**: " + nodeData.fetch("Node10.cpuload") + "% \n**RAM (USED/TOTAL)**: " + nodeData.fetch("Node10.memused") + " / " + nodeData.fetch("Node10.memtotal") + " \n**STORAGE (USED/TOTAL)**: " + nodeData.fetch("Node10.diskused") + " / " + nodeData.fetch("Node10.disktotal") + " \n**UPTIME**: " + nodeData.fetch("Node10.osuptime") + "\n**Servers**: **Total**: " + nodeData.fetch("Node10.dockercontainers") + ", **Running**: " + nodeData.fetch("Node10.dockercontainersrunning") + ", **Stopped**: " + nodeData.fetch("Node10.dockercontainersstopped"))
    embed.addField('\u200b', '\u200b')
    embed.addField("\u200b", "__**[Storage 1 - Storage](https://danbot.host/Storage1)**__ \n**CPU LOAD**: " + nodeData.fetch("Storage1.cpuload") + "% \n**RAM (USED/TOTAL)**: " + nodeData.fetch("Storage1.memused") + " / " + nodeData.fetch("Storage1.memtotal") + " \n**STORAGE (USED/TOTAL)**: " + nodeData.fetch("Storage1.diskused") + " / " + nodeData.fetch("Storage1.disktotal") + " \n**UPTIME**: " + nodeData.fetch("Storage1.osuptime") + "\n**Servers**: **Total**: " + nodeData.fetch("Storage1.dockercontainers") + ", **Running**: " + nodeData.fetch("Storage1.dockercontainersrunning") + ", **Stopped**: " + nodeData.fetch("Storage1.dockercontainersstopped"))
    embed.addField('\u200b', '\u200b')
    embed.addField('\u200b', `__**Total Usage:**__ \n__**Total CPU Cores:**__ \n${parseFloat(nodeData.fetch("Node1.cputhreads")) +
        parseFloat(nodeData.fetch("Node2.cputhreads")) +
        parseFloat(nodeData.fetch("Node3.cputhreads")) +
        parseFloat(nodeData.fetch("Node4.cputhreads")) +
        parseFloat(nodeData.fetch("Node5.cputhreads")) +
        parseFloat(nodeData.fetch("Node6.cputhreads")) +
        parseFloat(nodeData.fetch("Node7.cputhreads")) +
        parseFloat(nodeData.fetch("Node8.cputhreads")) +
        parseFloat(nodeData.fetch("Node9.cputhreads")) +
        parseFloat(nodeData.fetch("Node10.cputhreads")) +
        parseFloat(nodeData.fetch("Node11.cputhreads")) +
        parseFloat(nodeData.fetch("Node12.cputhreads")) +
        parseFloat(nodeData.fetch("Node13.cputhreads")) +
        parseFloat(nodeData.fetch("Node14.cputhreads")) +
        parseFloat(nodeData.fetch("Node15.cputhreads")) +
        parseFloat(nodeData.fetch("Storage1.cputhreads"))}
        \n__**Ram Total:**__ \n${formatFileSize(parseFloat(nodeData.fetch("Node1.memusedraw")) +
        parseFloat(nodeData.fetch("Node2.memusedraw")) +
        parseFloat(nodeData.fetch("Node3.memusedraw")) +
        parseFloat(nodeData.fetch("Node4.memusedraw")) +
        parseFloat(nodeData.fetch("Node5.memusedraw")) +
        parseFloat(nodeData.fetch("Node6.memusedraw")) +
        parseFloat(nodeData.fetch("Node7.memusedraw")) +
        parseFloat(nodeData.fetch("Node8.memusedraw")) +
        parseFloat(nodeData.fetch("Node9.memusedraw")) +
        parseFloat(nodeData.fetch("Node10.memusedraw")) +
        parseFloat(nodeData.fetch("Node11.memusedraw")) +
        parseFloat(nodeData.fetch("Node12.memusedraw")) +
        parseFloat(nodeData.fetch("Node13.memusedraw")) +
        parseFloat(nodeData.fetch("Node14.memusedraw")) +
        parseFloat(nodeData.fetch("Node15.memusedraw")) +
        parseFloat(nodeData.fetch("Storage1.memusedraw")))} out of ${formatFileSize(Math.floor(parseFloat(nodeData.fetch("Node1.memtotalraw")) +
        parseFloat(nodeData.fetch("Node2.memtotalraw")) +
        parseFloat(nodeData.fetch("Node3.memtotalraw")) +
        parseFloat(nodeData.fetch("Node4.memtotalraw")) +
        parseFloat(nodeData.fetch("Node5.memtotalraw")) +
        parseFloat(nodeData.fetch("Node6.memtotalraw")) +
        parseFloat(nodeData.fetch("Node7.memtotalraw")) +
        parseFloat(nodeData.fetch("Node8.memtotalraw")) +
        parseFloat(nodeData.fetch("Node9.memtotalraw")) +
        parseFloat(nodeData.fetch("Node10.memtotalraw")) +
        parseFloat(nodeData.fetch("Node11.memtotalraw")) +
        parseFloat(nodeData.fetch("Node12.memtotalraw")) +
        parseFloat(nodeData.fetch("Node13.memtotalraw")) +
        parseFloat(nodeData.fetch("Node14.memtotalraw")) +
        parseFloat(nodeData.fetch("Node15.memtotalraw")) +
        parseFloat(nodeData.fetch("Storage1.memtotalraw"))), 2)} \n` +
        `\n__**Disk Total:**__ ` +
        `\n${formatFileSize(parseFloat(nodeData.fetch("Node1.diskusedraw")) +
            parseFloat(nodeData.fetch("Node2.diskusedraw")) +
            parseFloat(nodeData.fetch("Node3.diskusedraw")) +
            parseFloat(nodeData.fetch("Node4.diskusedraw")) +
            parseFloat(nodeData.fetch("Node5.diskusedraw")) +
            parseFloat(nodeData.fetch("Node6.diskusedraw")) +
            parseFloat(nodeData.fetch("Node7.diskusedraw")) +
            parseFloat(nodeData.fetch("Node8.diskusedraw")) +
            parseFloat(nodeData.fetch("Node9.diskusedraw")) +
            parseFloat(nodeData.fetch("Node10.diskusedraw")) +
            parseFloat(nodeData.fetch("Node11.diskusedraw")) +
            parseFloat(nodeData.fetch("Node12.diskusedraw")) +
            parseFloat(nodeData.fetch("Node13.diskusedraw")) +
            parseFloat(nodeData.fetch("Node14.diskusedraw")) +
            parseFloat(nodeData.fetch("Node15.diskusedraw")) +
            parseFloat(nodeData.fetch("Storage1.diskusedraw")), 2)} ` +
        `out of ${formatFileSize(parseFloat(nodeData.fetch("Node1.disktotalraw")) +
            parseFloat(nodeData.fetch("Node2.disktotalraw")) +
            parseFloat(nodeData.fetch("Node3.disktotalraw")) +
            parseFloat(nodeData.fetch("Node4.disktotalraw")) +
            parseFloat(nodeData.fetch("Node5.disktotalraw")) +
            parseFloat(nodeData.fetch("Node7.disktotalraw")) +
            parseFloat(nodeData.fetch("Node8.disktotalraw")) +
            parseFloat(nodeData.fetch("Node9.disktotalraw")) +
            parseFloat(nodeData.fetch("Node10.disktotalraw")) +
            parseFloat(nodeData.fetch("Node11.disktotalraw")) +
            parseFloat(nodeData.fetch("Node12.disktotalraw")) +
            parseFloat(nodeData.fetch("Node13.disktotalraw")) +
            parseFloat(nodeData.fetch("Node14.disktotalraw")) +
            parseFloat(nodeData.fetch("Node15.disktotalraw")) +
            parseFloat(nodeData.fetch("Storage1.disktotalraw")), 2)}
        \n__**Total Servers:**__ \n**Total**: ${Math.floor(parseFloat(nodeData.fetch("Node1.dockercontainers")) +
            parseFloat(nodeData.fetch("Node2.dockercontainers")) +
            parseFloat(nodeData.fetch("Node3.dockercontainers")) +
            parseFloat(nodeData.fetch("Node4.dockercontainers")) +
            parseFloat(nodeData.fetch("Node5.dockercontainers")) +
            parseFloat(nodeData.fetch("Node6.dockercontainers")) +
            parseFloat(nodeData.fetch("Node7.dockercontainers")) +
            parseFloat(nodeData.fetch("Node8.dockercontainers")) +
            parseFloat(nodeData.fetch("Node9.dockercontainers")) +
            parseFloat(nodeData.fetch("Node10.dockercontainers")) +
            parseFloat(nodeData.fetch("Node11.dockercontainers")) +
            parseFloat(nodeData.fetch("Node12.dockercontainers")) +
            parseFloat(nodeData.fetch("Node13.dockercontainers")) +
            parseFloat(nodeData.fetch("Node14.dockercontainers")))} 
        \n**Running**: ${Math.floor(parseFloat(nodeData.fetch("Node1.dockercontainersrunning")) +
            parseFloat(nodeData.fetch("Node2.dockercontainersrunning")) +
            parseFloat(nodeData.fetch("Node3.dockercontainersrunning")) +
            parseFloat(nodeData.fetch("Node4.dockercontainersrunning")) +
            parseFloat(nodeData.fetch("Node5.dockercontainersrunning")) +
            parseFloat(nodeData.fetch("Node6.dockercontainersrunning")) +
            parseFloat(nodeData.fetch("Node7.dockercontainersrunning")) +
            parseFloat(nodeData.fetch("Node8.dockercontainersrunning")) +
            parseFloat(nodeData.fetch("Node9.dockercontainersrunning")) +
            parseFloat(nodeData.fetch("Node10.dockercontainersrunning")) +
            parseFloat(nodeData.fetch("Node11.dockercontainersrunning")) +
            parseFloat(nodeData.fetch("Node12.dockercontainersrunning")) +
            parseFloat(nodeData.fetch("Node13.dockercontainersrunning")) +
            parseFloat(nodeData.fetch("Node14.dockercontainersrunning")))} 
        \n**Stopped**: ${Math.floor(parseFloat(nodeData.fetch("Node1.dockercontainersstopped")) +
            parseFloat(nodeData.fetch("Node2.dockercontainersstopped")) +
            parseFloat(nodeData.fetch("Node3.dockercontainersstopped")) +
            parseFloat(nodeData.fetch("Node4.dockercontainersstopped")) +
            parseFloat(nodeData.fetch("Node5.dockercontainersstopped")) +
            parseFloat(nodeData.fetch("Node6.dockercontainersstopped")) +
            parseFloat(nodeData.fetch("Node7.dockercontainersstopped")) +
            parseFloat(nodeData.fetch("Node8.dockercontainersstopped")) +
            parseFloat(nodeData.fetch("Node9.dockercontainersstopped")) +
            parseFloat(nodeData.fetch("Node10.dockercontainersstopped")) +
            parseFloat(nodeData.fetch("Node11.dockercontainersstopped")) +
            parseFloat(nodeData.fetch("Node12.dockercontainersstopped")) +
            parseFloat(nodeData.fetch("Node13.dockercontainersstopped")) +
            parseFloat(nodeData.fetch("Node14.dockercontainersstopped")))}`)
    embed.setDescription('Want to view more stats live? [Click Here!](https://danbot.host/stats)')
    msg.edit(embed);
};
