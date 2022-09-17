const config = require("../../config.json");
const { Client, Message, EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const UserSchema = require("../../utils/Schemas/User");
const Pterodactyl = require('../../utils/pterodactyl/index');
const ptero = new Pterodactyl();

module.exports = {
    name: "list",
    description: "List all your servers",
    usage: "list [page]",
    example: "list 4",
    requiredPermissions: [],
    checks: [{
        check: () => config.discord.commands.serverCommandsEnabled,
        error: "The server commands are disabled!"
    }],
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const user = await UserSchema.findOne({ userId: message.author.id });

        if (!user) {
            message.reply("You are not linked to a panel account.");
            return;
        }

        const usersServers = (await ptero.servers(user.consoleId))?.data?.attributes?.relationships?.servers?.data;

        if (!usersServers) {
            message.reply("You don't have any servers.");
            return;
        }

        const serverList = usersServers.map(s => `\`${s.attributes.identifier}\` - \`${s.attributes.name.slice(0, 30)}\` `)

        if (!serverList.length) {
            message.reply("You don't have any servers.");
            return;
        }

        let page = 1;

        if (args[0] && !isNaN(args[0])) page = Math.max(1, Math.min(args[0], Math.ceil(serverList.length / 10)));


        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId("prev")
                .setLabel("Previous")
                .setStyle(ButtonStyle.Primary)
                .setEmoji('⬅')
            )
            .addComponents(
                new ButtonBuilder()
                .setCustomId("next")
                .setLabel("Next")
                .setStyle(ButtonStyle.Primary)
                .setEmoji('➡')
            )


        let embed = new EmbedBuilder()
            .setColor(Colors.Blurple)
            .setTitle("Your Servers")
            .setDescription(serverList.slice((page - 1) * 10, page * 10).join("\n"))
            .setFooter({
                text: `Page ${page} of ${Math.ceil(serverList.length / 10)}`,
            })


        const msg = await message.reply({
            embeds: [embed],
            components: [row]
        })

        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 300000,
        })

        collector.on("collect", async (i) => {
            if (i.user.id !== message.author.id) {
                i.reply({
                    ephemeral: true,
                    content: `This is <@!${message.author.id}>'s server list.`
                })
            }

            if (i.customId === "prev") {

                if (page === 1) {
                    i.reply({
                        ephemeral: true,
                        content: "You are on the first page."
                    })
                    return;
                }

                page--;

                embed.setDescription(serverList.slice((page - 1) * 10, page * 10).join("\n"))
                embed.setFooter({
                    text: `Page ${page} of ${Math.ceil(serverList.length / 10)}`,
                })
                i.update({
                    embeds: [embed],
                    components: [row]
                })
            } else {

                if (page === Math.ceil(serverList.length / 10)) {
                    i.reply({
                        ephemeral: true,
                        content: "You are on the last page."
                    })
                    return;
                }

                page++;

                embed.setDescription(serverList.slice((page - 1) * 10, page * 10).join("\n"))
                embed.setFooter({
                    text: `Page ${page} of ${Math.ceil(serverList.length / 10)}`,
                })
                i.update({
                    embeds: [embed],
                    components: [row]
                })
            }
        })

    }
}