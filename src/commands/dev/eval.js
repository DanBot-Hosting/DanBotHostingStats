const config = require("../../config.json");
const { Client, Message, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    name: "eval",
    description: "Eval Code",
    usage: "eval <code>",
    example: "eval message.reply('Hello World')",
    requiredPermissions: [],
    checks: [{
        check: (message) => message.member.roles.cache.has(config.discord.roles.owner),
        error: "You do not have the required roles to run this command."
        }],
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {
        try {
            const code = args.join(" ");

            if (!code) {
                message.channel.send("Please provide some code to evaluate.");
                return;
            }

            let evaled = eval(code);

            if (typeof evaled !== "string") {
                evaled = require("util").inspect(evaled);
            }

            const embed = new EmbedBuilder()
                .setColor(Colors.DarkBlue)
                .setTitle("Eval")
                .addFields({ name: `Output`, value:  `\`\`\`js\n${evaled}\`\`\`` })
                .setDescription(`\`\`\`js\n${code}\n\`\`\``)
                .setFooter({ text: `Evaled by ${message.author.tag}` });
            try {
                await message.channel.send({ embeds: [embed] });
            } catch (e) {}
        } catch (e) {
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle("Eval")
                .setDescription(`\`\`\`\n${e}\n\`\`\``)
                .setFooter({ text: `Evaled by ${message.author.tag}` });

            message.channel.send({ embeds: [embed] });
        }
    },
}