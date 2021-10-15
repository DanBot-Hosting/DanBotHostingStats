exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id === "898041741695926282")) return;
    var query = args.slice(1).join(" ").trim();

    if (!query) {
        message.channel.send('Command format: ' + config.DiscordBot.Prefix + 'dan google-images thing to search')
    } else {
        pup(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&safe=${(message.channel.nsfw) ? 'off' : 'on'}`);

        async function pup(url) {
            await message.react('🆗');
            try {
                let page = await browser.newPage();
                page.on("error", async error => {
                    message.channel.send(`⚠️ ${error.message}`);
                });
                await page.setViewport({width: 4096, height: 2160});
                await page.goto(url);
                let screenshot = await page.screenshot({type: 'png'});
                await message.channel.send({files: [{attachment: screenshot, name: "screenshot.png"}]});
                await page.close()
            } catch (error) {
                //message.channel.send(error)
                //page.close()
            } finally {
                try {
                    //page.close();
                } catch (error) {
                    //message.channel.send(error)
                }
            }
        }
    }
}
