const Discord = require("discord.js");
const axios = require("axios");
const humanizeDuration = require("humanize-duration");

const Config = require('../../../config.json');

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {
    // Get server IDs
    const serverIds = args
        .slice(1)
        .map((id) =>
            id.replace(`${Config.Pterodactyl.hosturl}/server/`, "").match(/[0-9a-z]+/i)?.[0]
        )
        .filter(Boolean);

    if (serverIds.length === 0) {
        message.reply(
            `Command format: \`${Config.DiscordBot.Prefix}server delete <SERVER_ID_1> <SERVER_ID_2> ...\``
        );
        return;
    }

    const msg = await message.reply(`Checking servers...`);

    try {
        // Fetch user's servers from Pterodactyl API
        const response = await axios({
            url: `${Config.Pterodactyl.hosturl}/api/application/users/${userData.get(
                message.author.id
            ).consoleID}?include=servers`,
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
                server.attributes.user === userData.get(message.author.id).consoleID
        );

        if (serversToDelete.length === 0) {
            msg.edit("No valid or owned servers found to delete.");
            return;
        }

        // Construct serverNames inside the try block
        const serverNames = serversToDelete
            .map((server) => server.attributes.name.split("@").join("@​"))
            .join(", ");

        // Confirmation (using reply for better UX)
        const confirmMsg = await message.reply(
            `Delete these servers: ${serverNames}?\nType \`confirm\` within 1 minute.`
        );

        try {
            // Await confirmation message (with a more robust filter)
            const confirmation = await message.channel.awaitMessages(
                (m) => m.author.id === message.author.id && m.content.toLowerCase() === 'confirm', 
                { max: 1, time: 60000, errors: ['time'] } // Options object in v12
            );

            if (!confirmation || confirmation.size === 0) {
                confirmMsg.edit("Request cancelled or timed out.");
                return;
            }

            confirmMsg.delete();

            // Deletion Loop (after successful confirmation)
            for (const server of serversToDelete) {
                await msg.edit(`Deleting server ${server.attributes.name}...`);
                try {
                    // Delete server from Pterodactyl API
                    await axios({
                        url: `${Config.Pterodactyl.hosturl}/api/application/servers/${server.attributes.id}/force`,
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${Config.Pterodactyl.apikey}`,
                        },
                    }).then(() => {
                        msg.edit(`Server ${server.attributes.name} deleted!`);

                        if (Config.DonatorNodes.find(x => x === server.attributes.node)) {
                            
                            userPrem.set(
                                message.author.id + ".used",
                                userPrem.fetch(message.author.id).used - 1,
                            );
                        }
                    });
                } catch (deletionError) {
                    console.error(`Error deleting server ${server.attributes.name}:`, deletionError);
                    msg.edit(`Failed to delete server ${server.attributes.name}. Please try again later.`);
                }
            }
        } catch (err) {
            console.error("Error during confirmation:", err);
            confirmMsg.edit("An error occurred during confirmation.");
        }
    } catch (err) {
        console.error("Error fetching server details:", err);

        msg.edit(
            "An error occurred while fetching server details. Please try again later."
        );
    }
};

exports.description = "Delete multiple servers. View this command for usage.";
