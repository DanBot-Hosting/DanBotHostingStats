exports.run = async(client, message) => {
    /*
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
        const data = nodeData.fetchAll();
        embed.fields.pop()

        data.forEach(function(entry) {
            if(entry.ID.includes('Node-')) {
                embed.addField(`${entry.ID}`, `t`)
                console.log(entry.ID)
                message.channel.send(msg)
            }
        });
        */
}
