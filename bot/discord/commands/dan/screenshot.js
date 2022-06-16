exports.run = async(client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id === "898041741695926282")) return;
    var query = args.slice(1).join(" ").trim();

    if (!query) {
        message.channel.send('Command format: ' + config.DiscordBot.Prefix + 'dan screenshot domainhere')
    } else {
        pup((query.startsWith("http://") || query.startsWith("https://")) ? query : `http://${query}`);

        async function pup(url) {
            await message.react('🆗');
            try {
                let page = await browser.newPage();
                page.on("error", async error => {
                    message.channel.send(`⚠️ ${error.message}`);
                });
                await page.setViewport({
                    width: 1920,
                    height: 1080
                });
                await page.goto(url);
                let screenshot = await page.screenshot({
                    type: 'png'
                });
                await message.channel.send({
                    files: [{
                        attachment: screenshot,
                        name: "screenshot.png"
                    }]
                });
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
