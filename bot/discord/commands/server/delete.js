const axios = require("axios");
const humanizeDuration = require("humanize-duration");

exports.run = async (client, message, args) => {
    // ... (Cooldown handling remains the same) ...

    // Get server IDs
    const serverIds = args.slice(1).map(id => id.replace("https://panel.danbot.host/server/", "").match(/[0-9a-z]+/i)?.[0]).filter(Boolean); 

    if (serverIds.length === 0) {
        message.reply(`Command format: \`${config.DiscordBot.Prefix}server delete <serverid1> <serverid2> ...\``);
        return;
    }

    const msg = await message.reply(`Checking servers...`);

    try {
        // Fetch user's servers
        const response = await axios({
            url: `https://panel.danbot.host/api/application/users/${userData.get(message.author.id).consoleID}?include=servers`,
            method:   
 "GET",
            headers: {
                Authorization: `Bearer ${config.Pterodactyl.apikey}`,
                "Content-Type": "application/json",
                Accept: "Application/vnd.pterodactyl.v1+json",   

            },
        });

        const userServers = response.data.attributes.relationships.servers.data;

        // Filter for valid and owned servers
        const serversToDelete = userServers.filter(server => 
            serverIds.includes(server.attributes?.identifier) && 
            server.attributes.user === userData.get(message.author.id).consoleID
        );

        if (serversToDelete.length === 0) {
            msg.edit("No valid or owned servers found to delete.");
            return;
        }

        // Confirmation prompt with server names
        const serverNames = serversToDelete.map(server => server.attributes.name.split("@").join("@​")).join(", ");
        await msg.edit(`Delete these servers: ${serverNames}?\nType \`confirm\` within 1 minute.`);


        const confirmation = await message.channel.awaitMessages({
            filter: (m) => m.author.id === message.author.id && m.content === "confirm",
            max: 1,
            time: 60000,
            errors: ['time'],
        }).catch(() => null); 

        if (!confirmation || !confirmation.size) {
            msg.edit("Request cancelled or timed out.");
            return;
        }

       for (const server of serversToDelete) {
            await msg.edit(`Deleting server ${server.attributes.name}...`);

            // Delete server
            await axios({
                url: `${config.Pterodactyl.hosturl}/api/application/servers/${server.attributes.id}/force`,
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${config.Pterodactyl.apikey}`,
                },
            });

            msg.edit(`Server ${server.attributes.name} deleted!`);

            // ... (Optional: Decrement premium usage if applicable)
        }
    } catch (err) {
        console.error("Error deleting servers:", err);
        msg.edit("An error occurred. Please try again later.");
    }
};

exports.description = "Delete a server. View this command for usage.";
