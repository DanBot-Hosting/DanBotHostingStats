const config = require("../../config.json");
const { Client, Message, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const UserSchema = require("../../utils/Schemas/User");
const servers = require("../../utils/pterodactyl/server/servers");
const deleteServer = require("../../utils/pterodactyl/server/deleteServer");
module.exports = {
    name: "delete",
    description: "delete a server.",
    usage: "delete <id>",
    example: "delete d7096fa9",
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

        const serverId = args[0];

        if (!serverId) return message.reply('Please specify a server ID.')

        const usersServers = (await servers(user.consoleId))?.data?.attributes?.relationships?.servers?.data;

        if (!usersServers) {
            message.reply("You don't have any servers.");
            return;
        }

        const server = usersServers.find(s => s.attributes.identifier === serverId || serverId.startsWith(s.attributes.identifier));

        if (!server) {
            message.reply("You don't have a server with that ID.");
            return;
        }


        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setLabel("Confirm")
                .setStyle("SUCCESS")
                .setCustomId("confirm")
                .setEmoji("✅")
            ).addComponents(
                new MessageButton()
                .setLabel("Cancel")
                .setStyle("DANGER")
                .setCustomId("cancel")
                .setEmoji("✖️")
            )

        const embed = new MessageEmbed()
            .setTitle("Are you sure?")
            .setDescription(`Are you sure you want to delete the server \`${server.attributes.name}\`?`)
            .setTimestamp()
            .setColor("BLURPLE")

        const msg = await message.reply({
            embeds: [embed],
            components: [row]
        })

        const collector = msg.createMessageComponentCollector({
            time: 30000,
        })

        collector.on("collect", async (i) => {
            if (i.user.id !== message.author.id) {
                i.reply({
                    ephemeral: true,
                    content: "You can't do that."
                })
                return;
            }

            if (i.customId == "confirm") {
                await i.deferReply({ ephemeral: true })

                const response = await deleteServer(server.attributes.id)


                if (response.error) {
                    i.editReply({
                        content: "An error occurred while deleting the server.",
                    })
                } else {
                    i.editReply({
                        content: "Server deleted.",
                    })
                }

                i?.message?.delete().catch(e => {
                    console.log(`Error deleting message: ${e}`)
                })

                collector.stop();

            } else if (i.customId == "cancel") {
                await i.update({
                    embeds: [],
                    components: [],
                    content: "Cancelled."
                })
                collector.stop();
            }
        })
    }
}