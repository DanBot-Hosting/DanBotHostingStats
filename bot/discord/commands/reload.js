exports.run = (client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id === "898041743566594049")) return message.channel.send("Sorry, No permission :O");
    try {
        fs.readdir("./bot/discord/commands/", (err, files) => {
            if (err) return console.error(err);
            message.channel.send(`Refreshed \`${files.length}\` commands successfully!`)
            files.forEach(file => {
                delete require.cache[require.resolve(`./${file}`)];
            });
        });
    } catch (err) {
        return;
    }
};