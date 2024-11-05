const Discord = require('discord.js');
const Axios = require('axios');
const Config = require('../../../config.json');

exports.description = "Delete multiple servers. View this command for usage.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {

    // Fetch user's servers from Pterodactyl API.
    const user = await userData.get(message.author.id);

    if (user == null) return message.channel.send('User does not have account linked.');

    // Retrive the server IDs.
    const serverIds = [...new Set(
        args
            .slice(1)
            .map((id) =>
                id.replace(`${Config.Pterodactyl.hosturl}/server/`, "").match(/[0-9a-z]+/i)?.[0]
            )
            .filter(Boolean)
    )];    

    if (serverIds.length === 0) {
        message.reply(
            `Command format: \`${Config.DiscordBot.Prefix}server delete <SERVER_ID_1> <SERVER_ID_2> ...\``
        );
        return;
    }

    const DeleteMessage = await message.reply(`Checking servers...`);

    try {
        const response = await Axios({
            url: `${Config.Pterodactyl.hosturl}/api/application/users/${user.consoleID}?include=servers`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${Config.Pterodactyl.apikey}`,
                "Content-Type": "application/json",
                Accept: "Application/vnd.pterodactyl.v1+json",
            },
        });

        const userServers = response.data.attributes.relationships.servers.data;

        // Filter for valid and owned servers
        const serversToDelete = userServers.filter(
            (server) =>
                serverIds.includes(server.attributes?.identifier) &&
                server.attributes.user === user.consoleID
        );

        if (serversToDelete.length === 0) {
            DeleteMessage.edit("No valid or owned servers found to delete.");
            return;
        }

        // Construct server names inside the try block
        const serverNames = serversToDelete
            .map((server) => server.attributes.name.split("@").join("@​"))
            .join(", ");

        // Buttons for confirmation and cancellation
        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('confirm')
                    .setLabel('Confirm')
                    .setStyle(Discord.ButtonStyle.Danger),
                new Discord.ButtonBuilder()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle(Discord.ButtonStyle.Secondary)
            );

        const ConfirmMessage = await DeleteMessage.edit({
            content: `Delete these servers: ${serverNames}?\nPlease choose an option:`,
            components: [row]
        });

        // Create button interaction collector.
        const Collector = ConfirmMessage.createMessageComponentCollector({
            componentType: Discord.ComponentType.Button,
            time: 30 * 1000,
            filter: (Interaction) => Interaction.user.id === message.author.id
        });

        Collector.on('collect', async (interaction) => {
            if (interaction.customId === 'confirm') {
                await interaction.update({ content: `Deleting servers...`, components: [] });
        
                let deletionResults = '';
                let serverCounter = 1;
        
                // Deletion Loop (after successful confirmation).
                for (const server of serversToDelete) {
                    try {
                        await Axios({
                            url: `${Config.Pterodactyl.hosturl}/api/application/servers/${server.attributes.id}/force`,
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${Config.Pterodactyl.apikey}`,
                            },
                        });
        
                        deletionResults += `Server #${serverCounter} deleted!\n`;
        
                        // Adjust user usage if it's a Donator Node.
                        if (Config.DonatorNodes.find(x => x === server.attributes.node)) {
                            await userPrem.sub(`${message.author.id}.used`, 1);
                        }

                        serverCounter++;
                    } catch (deletionError) {
                        deletionResults += `Failed to delete server ${server.attributes.name}.\n`;
                    }
                }
        
                await interaction.editReply({ content: deletionResults });

                Collector.stop('complete');
        
            } else if (interaction.customId === 'cancel') {
                await interaction.update({ content: 'Server deletion cancelled.', components: [] });
                Collector.stop('cancelled');
            }
        });

        Collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                ConfirmMessage.edit({ content: 'Server deletion timed out.', components: [] });
            }
        });

    } catch (err) {
        console.error("Error fetching server details:", err);
        DeleteMessage.edit("An error occurred while fetching server details. Please try again later.");
    }
};
