const Discord = require("discord.js");

/**
 * 
 * Displays the domains you have connected to your servers.
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @returns 
 */
exports.run = (client, message) => {
    // Request user data.
    const data = userData.get(message.author.id);

    // Check if the user has an account.
    if (!data) return message.reply("Nie posiadasz utworzonego konta.");

    // Check if the user has any domains.
    if (!data.domains?.length) return message.reply("Nie posiadasz żadnych domen.");

    const description = data.domains.map(domain => `- ${domain.domain} (ID serwera: ${domain.serverID})`).join("\n");

    if (description.length > 4096) {

        // If description is greater than 4096 characters, send it as a file.
        const attachment = new Discord.MessageAttachment(Buffer.from(description), 'domains.txt');
        return message.reply("Lista Twoich domen jest zbyt długa, aby ją tutaj wyświetlić. Zobacz załączony plik:", attachment);
    } else {

        // If description is less than 4096 characters, send it as a message.
        const embed = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setTitle("Twoje domeny:")
            .setDescription(description);

        return message.reply(embed);
    }
};

exports.description = "Wyświetla domeny podłączone do Twoich serwerów.";