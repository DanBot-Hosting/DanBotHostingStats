exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id === "639489438036000769")) return;
    var query = args.slice(1).join(" ").trim();

    pup((query.startsWith("http://") || query.startsWith("https://")) ? query : `http://${query}`);

    async function pup(url) {
        if (message.author.pendingResponse) {
            message.react('🚫');
            return;
        }
        message.author.pendingResponse = true;
        await message.react('🆗');
        try {
            let page = await browser.newPage();
            page.on("error", async error => {
                message.channel.send(`⚠️ ${error.message}`);
            });
            await page.setViewport({width: 1440, height: 900});
            await page.goto(url);
            let screenshot = await page.screenshot({type: 'png'});
            message.channel.send({files: [{attachment: screenshot, name: "screenshot.png"}]});
            await page.close()
        } catch (error) {
            console.error(error);
            message.channel.send(error)
        } finally {
            try {
                //page.close();
            } catch (error) {
                console.error(error);
                process.exit(1);
            }
        }
    }
}