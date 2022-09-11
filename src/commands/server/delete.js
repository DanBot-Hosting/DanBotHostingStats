const config = require("../../config.json");
const { Client, Message, EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const UserSchema = require("../../utils/Schemas/User");
const servers = require("../../utils/pterodactyl/server/servers");
const deleteServer = require("../../utils/pterodactyl/server/deleteServer");
const Premium = require("../../utils/Schemas/Premium");
const getLocations = require("../../utils/pterodactyl/locations/getLocations");

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
    cooldown: 15000,
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


        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel("Confirm")
                .setStyle(ButtonStyle.Success)
                .setCustomId("confirm")
                .setEmoji("✅")
            ).addComponents(
                new ButtonBuilder()
                .setLabel("Cancel")
                .setStyle(ButtonStyle.Danger)
                .setCustomId("cancel")
                .setEmoji("✖️")
            )

        const embed = new EmbedBuilder()
            .setTitle("Are you sure?")
            .setDescription(`Are you sure you want to delete the server \`${server.attributes.name}\`?`)
            .setTimestamp()
            .setColor(Colors.Blurple)

        const msg = await message.reply({
            embeds: [embed],
            components: [row]
        })

        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
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

                    const logEmbed = new EmbedBuilder()
                        .setTitle("Server deleted")
                        .setDescription(`Server \`${server.attributes.name}\` was deleted.`)
                        .addFields({ name: "Owner", value: message.author.tag })
                        .setTimestamp()
                        .setColor(Colors.Blurple)

                    const locations = (await getLocations())?.data;

                    if (!locations) return;

                    const location = locations.find(l => l?.attributes?.short == server?.attributes?.container?.environment?.P_SERVER_LOCATION);

                    if (!location) return;

                    const locationNodes = location?.attributes?.relationships?.nodes?.data;

                    if (!locationNodes) return;

                    const node = locationNodes.find(n => n.attributes.id == server.attributes.node);

                    if (!node) return;

                    const locationId = node?.attributes?.location_id;

                    if (config.pterodactyl.donatorGamingNodes.includes(locationId) || config.pterodactyl.donatorNodes.includes(locationId)) {
                        await Premium.updateOne({ userId: message.author.id }, { $inc: { premiumUsed: -1 } })
                    }

                    client.channels.cache.get(config.discord.channels.serverLogs)?.send({
                        embeds: [logEmbed]
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