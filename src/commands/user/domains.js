const Discord = require("discord.js");

/**
 * 
 * Displays the domains you have connected to your servers.
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @returns 
 */
exports.run = async (client, message) => {
    // Request user data.
    const data = await userData.get(message.author.id);

    // Check if the user has an account.
    if (!data) return await message.reply("You do not have an account.");

    // Check if the user has any domains.
    if (!data.domains?.length) return await message.reply("You do not have any domains.");

    const description = data.domains.map(domain => `- ${domain.domain} (Server ID: ${domain.serverID})`).join("\n");

    if (description.length > 4096) {

        // If description is greater than 4096 characters, send it as a file.
        const Attachment = new Discord.AttachmentBuilder(Buffer.from(description), { name: 'domains.txt'});
        return await message.reply(
            {
                content: "Your domains list is too long to display here. Please see the attached file:",
                files: [Attachment]
            }
        );
    } else {

        // If description is less than 4096 characters, send it as a message.
        const Embed = new Discord.EmbedBuilder()
            .setColor("Blue")
            .setTitle("Your Domains")
            .setDescription(description);

        return message.reply({embeds: [Embed]});
    }
};

exports.description = "Displays the domains you have connected to your servers.";