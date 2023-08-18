exports.run = async (client, message) => {
    let args = message.content.split(" ").slice(1);
    let cont = message.content.split(" ").slice(1).join(" ");

    if (
        message.member.roles.cache.find((r) => r.id === "898041743566594049") ||
        message.member.roles.cache.find((r) => r.id === "898041741695926282")
    ) {
        function clean(text) {
            if (typeof text !== "string")
                text = require("util").inspect(text, {
                    depth: 0,
                });
            let rege = new RegExp(client.token, "gi");
            let rege2 = new RegExp("6 + 9", "gi");
            text = text
                .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203))
                .replace(
                    rege,
                    "(node:800) UnhandledPromiseRejectionWarning: Error: Incorrect login details were provided."
                )
                .replace(rege2, "69");
            return text;
        }
        message.reply("Evaluating...").then((msg) => {
            try {
                let code = args.join(" ");
                let evaled = eval(code);

                if (typeof evaled !== "string") {
                    evaled = require("util").inspect(evaled);
                }
                if (evaled.length > 2000) {
                    try {
                        let evalcode1 = new Discord.MessageEmbed()
                            .setAuthor(
                                `Eval by ${message.author.tag}`,
                                `https://cdn.discordapp.com/emojis/314405560701419520.png`
                            )
                            .setDescription(`**Input:**\n\n\`\`\`js\n${cont}\`\`\``, true)
                            .addField(
                                `\u200b`,
                                `**Output:**\n\n\`\`\`js\nOutput too long, logged to ${__dirname}\\eval.txt\`\`\``,
                                true
                            )
                            .setColor(0x00ff00)
                            .setFooter(`Node.js - Time taken: ${Date.now() - message.createdTimestamp} ms`);
                        msg.edit({
                            embed: evalcode1,
                        }),
                            fs.writeFile(`eval.txt`, `${clean(evaled)}`),
                            message.reply("Eval output", {
                                files: ["eval.txt"],
                            });
                        return fs.writeFile(`eval.txt`, `${clean(evaled)}`);
                    } catch (err) {
                        let errorcode1 = new Discord.MessageEmbed()
                            .setAuthor(
                                `Eval by ${message.author.tag}`,
                                `https://cdn.discordapp.com/emojis/314405560701419520.png`
                            )
                            .setDescription(`**Input:**\n\n\`\`\`js\n${cont}\`\`\``, true)
                            .addField(
                                `\u200b`,
                                `**Output:**\n\n\`\`\`js\nOutput too long, logged to ${__dirname}\\eval.txt\`\`\``,
                                true
                            )
                            .setColor(0xff0000)
                            .setFooter(
                                `Node.js - Time taken: ${Date.now() - message.createdTimestamp} ms `,
                                `https://images-ext-2.discordapp.net/eyJ1cmwiOiJodHRwczovL2Euc2FmZS5tb2UvVUJFVWwucG5nIn0.LbWCXwiUul3udoS7s20IJYW8xus`
                            );
                        msg.edit({
                            embed: errorcode1,
                        });
                        return fs.writeFile(`eval.txt`, `${clean(err)}`);
                    }
                }
                let evalcode = new Discord.MessageEmbed()
                    .setAuthor(
                        `Eval by ${message.author.tag}`,
                        `https://cdn.discordapp.com/emojis/314405560701419520.png`
                    )
                    .setDescription(`**:inbox_tray: Input:**\n\n\`\`\`js\n${cont}\`\`\``, true)
                    .addField(`\u200b`, `**:outbox_tray: Output:**\n\n\`\`\`js\n${clean(evaled)}\`\`\``, true)
                    .setColor(0x00ff00)
                    .setFooter(`Node.js - Time taken: ${Date.now() - message.createdTimestamp} ms`);
                msg.edit({
                    embed: evalcode,
                }).catch((e) => {});
            } catch (err) {
                let errorcode = new Discord.MessageEmbed()
                    .setAuthor(
                        `Eval by ${message.author.tag}`,
                        `https://cdn.discordapp.com/emojis/314405560701419520.png`
                    )
                    .setDescription(`**:inbox_tray: Input:**\n\n\`\`\`js\n${cont}\`\`\``, true)
                    .addField(`\u200b`, `**:outbox_tray: Output:**\`\`\`js\n${clean(err)}\`\`\``, true)
                    .setColor(0xff0000)
                    .setFooter(`Node.js - Time taken: ${Date.now() - message.createdTimestamp}ms`);
                msg.edit({
                    content: "",
                    embed: errorcode,
                }).catch((e) => {});
            }
        });
    } else if (!message.member.roles.cache.find((r) => r.id === "898041741695926282")) {
        message.reply("Evaluating...").then((msg) => {
            const responses = [
                "SyntaxError: Unexpected token F in JSON at position 48",
                "SyntaxError: Unexpected identifier",
                "UnhandledPromiseRejectionWarning: DiscordAPIError: Missing Permissions",
                "TypeError: Cannot read property 'messages' of undefined",
                "UnhandledPromiseRejectionWarning: MongoError: bad auth : Authentication failed.",
                `TypeError: Cannot read property '${args.join(" ")}' of undefined`,
                "The FitnessGram™ Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly, but gets faster each minute after you hear this signal. [beep] A single lap should be completed each time you hear this sound. [ding] Remember to run in a straight line, and run as long as possible. The second time you fail to complete a lap before the sound, your test is over. The test will begin on the word start. On your mark, get ready, start."
            ];
            var randomResponse =
                responses[Math.floor(Math.random() * responses.length)];
            let errorcodefake = new Discord.MessageEmbed()
                .setAuthor(`Eval by ${message.author.tag}`, `https://cdn.discordapp.com/emojis/314405560701419520.png`)
                .setDescription(`**:inbox_tray: Input:**\n\n\`\`\`js\n${cont}\`\`\``, true)
                .addField(
                    `\u200b`,
                    `**:outbox_tray: Output:**\`\`\`\n${randomResponse}\`\`\``,
                    true
                )
                .setColor(0xff0000)
                .setFooter(`Node.js - Time taken: ${Date.now() - message.createdTimestamp}ms`);
            msg.edit({
                content: "",
                embed: errorcodefake,
            }).catch((e) => {});
        });
    }
};
