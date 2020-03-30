exports.run = (client, message, args) => {
    if (message.author.id !== config.DiscordBot.ownerID) return message.channel.send("Sorry, No permission :O");
    try {

        //Alerts me that the Node Monitor is now running. (Please Please Please. If you run this bot only run this once or you might get spam and banned from discord)
        message.channel.send('Monitor is now running and watching all nodes for `DanBot Hosting`. Any issues will be updated and sent in <#640158471001735169>')

        //Node Monitor
        setInterval(() => {
            //Data for node 1
            var N1 = fs.readFileSync('./data/0286b2ad-dc80-4b5c-a0de-b81945b010e8.json', 'utf8');
            var Node1 = JSON.parse(N1);
          
            //Data for node 2
            var N2 = fs.readFileSync('./data/2e3f071a-af2b-4dc9-be5a-7ce72590a181.json', 'utf8');
            var Node2 = JSON.parse(N2);
           
            //Data for node 3
            var N3 = fs.readFileSync('./data/6fc3e9bf-24a8-47cd-99d3-fa159e05a9f4.json', 'utf8');
            var Node3 = JSON.parse(N3);
          
            //Data for node 4
            var N4 = fs.readFileSync('./data/15ffcdd0-a021-4ded-977d-284d777330a0.json', 'utf8');
            var Node4 = JSON.parse(N4);
        
            //Runs if statements for each node. this checks each node's ram
            if (Node1.memused >= "7.5 GB") {
            return client.channels.get("640158471001735169").send("⚠️ `Node 1` is currently running with " + Node1.memused + " out of " + Node1.memtotal + ". Will continue to monitor this node!"), client.channels.get("640158471001735169").setTopic('⚠️Monitoring: Node 1 running with ' + Node1.memused + " out of " + Node1.memtotal)
            };
            
            client.guilds.get("639477525927690240").channels.get("640158471001735169").fetchMessage("693937194863427655")
            .then(msgb => {
                console.log(msgb.content)
                msgb.edit("testing")
            })
           // Node1msg.edit('testing')

            //if (Node1.memused >= "7.5 GB") return client.channels.get("640158471001735169").send("⚠️ `Node 1` is currently running with " + Node1.memused + " out of " + Node1.memtotal + ". Will continue to monitor this node!"), client.channels.get("640158471001735169").setTopic('⚠️Monitoring: Node 1 running with ' + Node1.memused + " out of " + Node1.memtotal)
            //if (Node2.memused >= "7.5 GB") return client.channels.get("640158471001735169").send("⚠️ `Node 2` is currently running with " + Node2.memused + " out of " + Node2.memtotal + ". Will continue to monitor this node!"), client.channels.get("640158471001735169").setTopic('⚠️Monitoring: Node 2 running with ' + Node2.memused + " out of " + Node2.memtotal)
            //if (Node3.memused >= "7.5 GB") return client.channels.get("640158471001735169").send("⚠️ `Node 3` is currently running with " + Node3.memused + " out of " + Node3.memtotal + ". Will continue to monitor this node!"), client.channels.get("640158471001735169").setTopic('⚠️Monitoring: Node 3 running with ' + Node3.memused + " out of " + Node3.memtotal)
            //if (Node4.memused >= "7.5 GB") return client.channels.get("640158471001735169").send("⚠️ `Node 4` is currently running with " + Node4.memused + " out of " + Node4.memtotal + ". Will continue to monitor this node!"), client.channels.get("640158471001735169").setTopic('⚠️Monitoring: Node 4 running with ' + Node4.memused + " out of " + Node4.memtotal)
        }, 5000);  

} catch (err) {
      return console.log(err)
    }
};