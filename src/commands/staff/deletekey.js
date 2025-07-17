const Discord = require("discord.js");
const MiscConfigs = require('../../../config/misc-configs.js');

exports.description = "Delete a premium key.";

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {
    if (!MiscConfigs.codeDrops.includes(message.author.id)) {
        return;
    }

    if (!args[1]) {
        await message.reply("You need to specify a code to delete.");
        return;
    }

    const codeToDelete = args[1];

    try {
        // If the user wants to delete all the codes.
        if(codeToDelete == "all"){
            await codes.deleteAll().catch(() => {});
    
            await message.reply("Successfully deleted all codes.");
        } else {
            const codeExists = await codes.get(codeToDelete);
        
            if (!codeExists) {
                await message.reply("This code does not exist.");
                return;
            }
    
            await codes.delete(codeToDelete).catch(() => {});
    
            await message.reply(`Successfully deleted the code: \`${codeToDelete}\``);
        }
    } catch (error) {
        await message.reply("An error occurred while trying to delete the code(s).");
    }
};
