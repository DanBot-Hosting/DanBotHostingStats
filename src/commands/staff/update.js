const Discord = require("discord.js");
const cap = require("../../util/cap");
const exec = require("child_process").exec;
const Util = require('util');
const execPromise = Util.promisify(exec);

const Config = require('../../../config.json');
const MiscConfigs = require('../../../config/misc-configs.js');

exports.description = "Updates the bot from GitHub. Locked to Bot Administrators.";

/**
 * Update the bot from GitHub.
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {

    // Checks if the user has the Bot Administrator Role.
    if (!message.member.roles.cache.find((r) => r.id === Config.DiscordBot.Roles.BotAdmin)) return;

    try {
        const { stdout } = await execPromise('git pull');
            
        if (!stdout.includes("Already up to date.")) {

            await message.reply("Pulling files from GitHub.");

            await client.channels.cache
                .get(MiscConfigs.github)
                .send(
                    `<t:${Math.floor(Date.now() / 1000)}:f> Update requested by <@${message.author.id}>, pulling files.\n\`\`\`${stdout}\`\`\``
                );

            setTimeout(() => {
                process.exit();
            }, 10 * 1000);
        } else {
            await message.reply("Discord bot is already up to date.");
        }
    } catch (error) {
        console.error(`[STAFF UPDATE] Error with git pull: ${error.message}`);
    }
};
