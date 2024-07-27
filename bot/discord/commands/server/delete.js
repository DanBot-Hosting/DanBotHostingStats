const axios = require("axios");
const humanizeDuration = require("humanize-duration");

exports.run = async (client, message, args) => {
    // Initialize cooldown if not present
    client.cooldown[message.author.id] ??= {
        nCreate: null,
        pCreate: null,
        delete: null,
    };

    // Cooldown check
    const cooldownRemaining = client.cooldown[message.author.id].delete - Date.now();
    if (cooldownRemaining > 0) {
        message.reply(
            `You're on cooldown. Please wait ${humanizeDuration(cooldownRemaining, { round: true })}`
        );
        return;
    }

    // Set cooldown (3 seconds)
    client.cooldown[message.author.id].delete = Date.now() + 3e3;

    // Get server IDs
    const serverIds = args
        .slice(1)
        .map((id) =>
            id.replace("https://panel.danbot.host/server/", "").match(/[0-9a-z]+/i)?.[0]
        )
        .filter(Boolean);

    if (serverIds.length === 0) {
        message.reply(
            `Command format: \`${config.DiscordBot.Prefix}server delete <serverid1> <serverid2> ...\``
        );
        return;
    }

    const msg = await message.reply(`Checking servers...`);

    try {
        // Fetch user's servers from Pterodactyl API
        const response = await axios({
            url: `https://panel.danbot.host/api/application/users/${userData.get(
                message.author.id
            ).consoleID}?include=servers`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${config.Pterodactyl.apikey}`,
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

        // Collector for confirmation message
        const collectorFilter = (m) => 
            m.author.id === message.author.id && m.content.toLowerCase() === "confirm";

        const collector = message.channel.createMessageCollector({
            filter: collectorFilter,
            max: 1,
            time: 60000,
        });

        collector.on('collect', async () => {
            confirmMsg.delete(); 
            for (const server of serversToDelete) {
                await msg.edit(`Deleting server ${server.attributes.name}...`);
                try {
                    // Delete server from Pterodactyl API
                    await axios({
                        url: `${config.Pterodactyl.hosturl}/api/application/servers/${
                            server.attributes.id
                        }/force`,
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${config.Pterodactyl.apikey}`,
                        },
                    });
    
                    msg.edit(`Server ${server.attributes.name} deleted!`);
                    // (Optional) Decrement premium usage if applicable
                } catch (deletionError) {
                    console.error(`Error deleting server ${server.attributes.name}:`, deletionError);
                    msg.edit(`Failed to delete server ${server.attributes.name}. Please try again later.`);
                }
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                confirmMsg.edit('Request timed out.');
            }
        });
    } catch (err) {
        console.error("Error fetching server details:", err);
        msg.edit(
            "An error occurred while fetching server details. Please try again later."
        );
    }
};

exports.description = "Delete multiple servers. View this command for usage.";
