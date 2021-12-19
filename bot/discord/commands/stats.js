const {
  MessageEmbed
} = require("discord.js");
exports.run = async (client, message) => {
  // filesize function

  function formatFileSize(bytes, decimalPoint) {
    if (bytes === 0) return "0 Bytes";
    let k = 1024,
      dm = decimalPoint || 2,
      sizes = ["Bytes", "KB", "MB", "GB", "TB"],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }


  const firstEmb = new MessageEmbed()
    .setColor(`RANDOM`)
    .addField(
      `__**Please wait...**__`,
      `Loading all node's stats! (If this takes longer than 5seconds. This command is broken)`,
      true
    );
  const msg = await message.channel.send({
    embed: firstEmb
  });

  let nodes = ["Node1", "Node2", "Node3",
    "Node4", "Node5", "Node6",
    "Node7", "Node8", "Node9",
    "Node10", "Node11", "Node12",
    "Node13", "Node14", "Node15",
    "Node16", "Storage1"]


  const getData = (key) => nodes.map(node => parseFloat((nodeData.fetch(`${node}.${key}`) || 0))).reduce((oldValue, value) => oldValue + value, 0);

  // gets the info and stuff
  const getCpuThreads = getData("cputhreads");

  const getMemory = formatFileSize(getData("memusedraw"), 2) + " out of " + formatFileSize(getData("memtotalraw"), 2);

  const getDisc1 = formatFileSize(getData("diskusedraw"), 2)

  const getDisc2 = formatFileSize(getData("disktotalraw"), 2)

  const getServersTotal = Math.floor(getData("dockercontainers"));

  const getServersRunning = Math.floor(getData("dockercontainersrunning"));

  const getServersStopped = Math.floor(getData("dockercontainersstopped"));


  const newEmbed = new MessageEmbed()
    .setDescription(
      "Want to view more stats live? [Click Here!](https://danbot.host/stats)"
    )
    .setColor("#4E5D94")
    .addFields({
      inline: true,
      name: "\u200b",
      value: "__**[Node 1 - Bots, Websites and Databases](https://danbot.host/Node1)**__ \n**CPU LOAD**: " +
        nodeData.fetch("Node1.cpuload") +
        "% \n**RAM (USED/TOTAL)**: " +
        nodeData.fetch("Node1.memused") +
        " / " +
        nodeData.fetch("Node1.memtotal") +
        " \n**STORAGE (USED/TOTAL)**: " +
        nodeData.fetch("Node1.diskused") +
        " / " +
        nodeData.fetch("Node1.disktotal") +
        " \n**UPTIME**: " +
        nodeData.fetch("Node1.osuptime") +
        "\n**Servers:** **Total**: " +
        nodeData.fetch("Node1.dockercontainers") +
        ", **Running**: " +
        nodeData.fetch("Node1.dockercontainersrunning") +
        ", **Stopped**: " +
        nodeData.fetch("Node1.dockercontainersstopped"),
    }, {
      inline: true,
      name: "\u200b",
      value: "\u200b"
    }, {
      inline: true,
      name: "\u200b",
      value: "__**[Node 2 - Bots, Websites and Databases](https://danbot.host/Node2)**__ \n**CPU LOAD**: " +
        nodeData.fetch("Node2.cpuload") +
        "% \n**RAM (USED/TOTAL)**: " +
        nodeData.fetch("Node2.memused") +
        " / " +
        nodeData.fetch("Node2.memtotal") +
        " \n**STORAGE (USED/TOTAL)**: " +
        nodeData.fetch("Node2.diskused") +
        " / " +
        nodeData.fetch("Node2.disktotal") +
        " \n**UPTIME**: " +
        nodeData.fetch("Node2.osuptime") +
        "\n**Servers**: **Total**: " +
        nodeData.fetch("Node2.dockercontainers") +
        ", **Running**: " +
        nodeData.fetch("Node2.dockercontainersrunning") +
        ", **Stopped**: " +
        nodeData.fetch("Node2.dockercontainersstopped"),
    }, {
      inline: true,
      name: "\u200b",
      value: "\u200b"
    }, {
      inline: true,
      name: "\u200b",
      value: "__**[Node 3 - Gaming](https://danbot.host/Node3)**__ \n**CPU LOAD**: " +
        nodeData.fetch("Node3.cpuload") +
        "% \n**RAM (USED/TOTAL)**: " +
        nodeData.fetch("Node3.memused") +
        " / " +
        nodeData.fetch("Node3.memtotal") +
        " \n**STORAGE (USED/TOTAL)**: " +
        nodeData.fetch("Node3.diskused") +
        " / " +
        nodeData.fetch("Node3.disktotal") +
        " \n**UPTIME**: " +
        nodeData.fetch("Node3.osuptime") +
        "\n**Servers**: **Total**: " +
        nodeData.fetch("Node3.dockercontainers") +
        ", **Running**: " +
        nodeData.fetch("Node3.dockercontainersrunning") +
        ", **Stopped**: " +
        nodeData.fetch("Node3.dockercontainersstopped"),
    }, {
      inline: true,
      name: "\u200b",
      value: "\u200b"
    }, {
      inline: true,
      name: "\u200b",
      value: "__**[Node 4 - Test](https://danbot.host/Node4)**__ \n**CPU LOAD**: " +
        nodeData.fetch("Node4.cpuload") +
        "% \n**RAM (USED/TOTAL)**: " +
        nodeData.fetch("Node4.memused") +
        " / " +
        nodeData.fetch("Node4.memtotal") +
        " \n**STORAGE (USED/TOTAL)**: " +
        nodeData.fetch("Node4.diskused") +
        " / " +
        nodeData.fetch("Node4.disktotal") +
        " \n**UPTIME**: " +
        nodeData.fetch("Node4.osuptime") +
        "\n**Servers**: **Total**: " +
        nodeData.fetch("Node4.dockercontainers") +
        ", **Running**: " +
        nodeData.fetch("Node4.dockercontainersrunning") +
        ", **Stopped**: " +
        nodeData.fetch("Node4.dockercontainersstopped"),
    }, {
      inline: true,
      name: "\u200b",
      value: "\u200b"
    }, {
      inline: true,
      name: "\u200b",
      value: "__**[Node 5 - Bots, Websites and Databases](https://danbot.host/Node5)**__ \n**CPU LOAD**: " +
        nodeData.fetch("Node5.cpuload") +
        "% \n**RAM (USED/TOTAL)**: " +
        nodeData.fetch("Node5.memused") +
        " / " +
        nodeData.fetch("Node5.memtotal") +
        " \n**STORAGE (USED/TOTAL)**: " +
        nodeData.fetch("Node5.diskused") +
        " / " +
        nodeData.fetch("Node5.disktotal") +
        " \n**UPTIME**: " +
        nodeData.fetch("Node5.osuptime") +
        "\n**Servers**: **Total**: " +
        nodeData.fetch("Node5.dockercontainers") +
        ", **Running**: " +
        nodeData.fetch("Node5.dockercontainersrunning") +
        ", **Stopped**: " +
        nodeData.fetch("Node5.dockercontainersstopped"),
    }, {
      inline: true,
      name: "\u200b",
      value: "\u200b"
    }, {
      inline: true,
      name: "\u200b",
      value: "__**[Node 6 - Bots, Websites and Databases](https://danbot.host/Node6)**__ \n**CPU LOAD**: " +
        nodeData.fetch("Node6.cpuload") +
        "% \n**RAM (USED/TOTAL)**: " +
        nodeData.fetch("Node6.memused") +
        " / " +
        nodeData.fetch("Node6.memtotal") +
        " \n**STORAGE (USED/TOTAL)**: " +
        nodeData.fetch("Node6.diskused") +
        " / " +
        nodeData.fetch("Node6.disktotal") +
        " \n**UPTIME**: " +
        nodeData.fetch("Node6.osuptime") +
        "\n**Servers**: **Total**: " +
        nodeData.fetch("Node6.dockercontainers") +
        ", **Running**: " +
        nodeData.fetch("Node6.dockercontainersrunning") +
        ", **Stopped**: " +
        nodeData.fetch("Node6.dockercontainersstopped"),
    }, {
      inline: true,
      name: "\u200b",
      value: "\u200b"
    }, {
      inline: true,
      name: "\u200b",
      value: "__**[Node 7 - Donator Node](https://danbot.host/Node7)**__ \n**CPU LOAD**: " +
        nodeData.fetch("Node7.cpuload") +
        "% \n**RAM (USED/TOTAL)**: " +
        nodeData.fetch("Node7.memused") +
        " / " +
        nodeData.fetch("Node7.memtotal") +
        " \n**STORAGE (USED/TOTAL)**: " +
        nodeData.fetch("Node7.diskused") +
        " / " +
        nodeData.fetch("Node7.disktotal") +
        " \n**UPTIME**: " +
        nodeData.fetch("Node7.osuptime") +
        "\n**Servers**: **Total**: " +
        nodeData.fetch("Node7.dockercontainers") +
        ", **Running**: " +
        nodeData.fetch("Node7.dockercontainersrunning") +
        ", **Stopped**: " +
        nodeData.fetch("Node7.dockercontainersstopped"),
    }, {
      inline: true,
      name: "\u200b",
      value: "\u200b"
    }, {
      inline: true,
      name: "\u200b",
      value: "__**[Node 8 - Gaming Node BETA](https://danbot.host/Node8)**__ \n**CPU LOAD**: " +
        nodeData.fetch("Node8.cpuload") +
        "% \n**RAM (USED/TOTAL)**: " +
        nodeData.fetch("Node8.memused") +
        " / " +
        nodeData.fetch("Node8.memtotal") +
        " \n**STORAGE (USED/TOTAL)**: " +
        nodeData.fetch("Node8.diskused") +
        " / " +
        nodeData.fetch("Node8.disktotal") +
        " \n**UPTIME**: " +
        nodeData.fetch("Node8.osuptime") +
        "\n**Servers**: **Total**: " +
        nodeData.fetch("Node8.dockercontainers") +
        ", **Running**: " +
        nodeData.fetch("Node8.dockercontainersrunning") +
        ", **Stopped**: " +
        nodeData.fetch("Node8.dockercontainersstopped"),
    }, {
      inline: true,
      name: "\u200b",
      value: "\u200b"
    }, {
      inline: true,
      name: "\u200b",
      value: "__**[Node 9 - Bots, Websites and Databases](https://danbot.host/Node9)**__ \n**CPU LOAD**: " +
        nodeData.fetch("Node9.cpuload") +
        "% \n**RAM (USED/TOTAL)**: " +
        nodeData.fetch("Node9.memused") +
        " / " +
        nodeData.fetch("Node9.memtotal") +
        " \n**STORAGE (USED/TOTAL)**: " +
        nodeData.fetch("Node9.diskused") +
        " / " +
        nodeData.fetch("Node9.disktotal") +
        " \n**UPTIME**: " +
        nodeData.fetch("Node9.osuptime") +
        "\n**Servers**: **Total**: " +
        nodeData.fetch("Node9.dockercontainers") +
        ", **Running**: " +
        nodeData.fetch("Node9.dockercontainersrunning") +
        ", **Stopped**: " +
        nodeData.fetch("Node9.dockercontainersstopped"),
    }, {
      inline: true,
      name: "\u200b",
      value: "\u200b"
    }, {
      inline: true,
      name: "\u200b",
      value: "__**[Node 10 - Bots, Websites and Databases](https://danbot.host/Node10)**__ \n**CPU LOAD**: " +
        nodeData.fetch("Node10.cpuload") +
        "% \n**RAM (USED/TOTAL)**: " +
        nodeData.fetch("Node10.memused") +
        " / " +
        nodeData.fetch("Node10.memtotal") +
        " \n**STORAGE (USED/TOTAL)**: " +
        nodeData.fetch("Node10.diskused") +
        " / " +
        nodeData.fetch("Node10.disktotal") +
        " \n**UPTIME**: " +
        nodeData.fetch("Node10.osuptime") +
        "\n**Servers**: **Total**: " +
        nodeData.fetch("Node10.dockercontainers") +
        ", **Running**: " +
        nodeData.fetch("Node10.dockercontainersrunning") +
        ", **Stopped**: " +
        nodeData.fetch("Node10.dockercontainersstopped"),
    }, {
      inline: true,
      name: "\u200b",
      value: "\u200b"
    }, {
      inline: true,
      name: "\u200b",
      value: "__**[Node 10 - Bots, Websites and Databases](https://danbot.host/Node10)**__ \n**CPU LOAD**: " +
        nodeData.fetch("Node10.cpuload") +
        "% \n**RAM (USED/TOTAL)**: " +
        nodeData.fetch("Node10.memused") +
        " / " +
        nodeData.fetch("Node10.memtotal") +
        " \n**STORAGE (USED/TOTAL)**: " +
        nodeData.fetch("Node10.diskused") +
        " / " +
        nodeData.fetch("Node10.disktotal") +
        " \n**UPTIME**: " +
        nodeData.fetch("Node10.osuptime") +
        "\n**Servers**: **Total**: " +
        nodeData.fetch("Node10.dockercontainers") +
        ", **Running**: " +
        nodeData.fetch("Node10.dockercontainersrunning") +
        ", **Stopped**: " +
        nodeData.fetch("Node10.dockercontainersstopped"),
    }, {
      inline: true,
      name: "\u200b",
      value: "__**[Storage 1 - Storage](https://danbot.host/Storage1)**__ \n**CPU LOAD**: " +
        nodeData.fetch("Storage1.cpuload") +
        "% \n**RAM (USED/TOTAL)**: " +
        nodeData.fetch("Storage1.memused") +
        " / " +
        nodeData.fetch("Storage1.memtotal") +
        " \n**STORAGE (USED/TOTAL)**: " +
        nodeData.fetch("Storage1.diskused") +
        " / " +
        nodeData.fetch("Storage1.disktotal") +
        " \n**UPTIME**: " +
        nodeData.fetch("Storage1.osuptime") +
        "\n**Servers**: **Total**: " +
        nodeData.fetch("Storage1.dockercontainers") +
        ", **Running**: " +
        nodeData.fetch("Storage1.dockercontainersrunning") +
        ", **Stopped**: " +
        nodeData.fetch("Storage1.dockercontainersstopped"),
    }, {
      inline: true,
      name: "\u200b",
      value: `__**Total Usage:**__ \n__**Total CPU Cores:**__ \n${getCpuThreads}\n__**Ram Total:**__ \n${getMemory} \n` +
        `\n__**Disk Total:**__ ` +
        `\n${getDisc1} ` +
        `out of ${getDisc2}\n__**Total Servers:**__ \n**Total**: ${getServersTotal} \n**Running**: ${getServersRunning} \n**Stopped**: ${getServersStopped}`,
    });
  msg.edit({
    embed: newEmbed
  });
};
