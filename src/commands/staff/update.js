const cap = require("../../util/cap");
const exec = require("child_process").exec;

const Config = require('../../../config.json');
const MiscConfigs = require('../../../config/misc-configs.js');

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

    console.log("Updating the bot from GitHub.");

    // Pulls the files from GitHub.
    exec(`git pull`, (error, stdout) => {
        let response = error || stdout;
        if (!error) {
            if (response.includes("Already up to date.")) {
                message.reply("All files are already up to date.");
            } else {
                client.channels.cache
                    .get(MiscConfigs.github)
                    .send(
                        `<t:${Date.now().toString().slice(0, -3)}:f> Update requested by <@${message.author.id}>, pulling files.\n\`\`\`${cap(response, 1900)}\`\`\``,
                    );

                message.reply("Pulling files from GitHub.");
                setTimeout(() => {
                    process.exit();
                }, 1000);
            }
        }
    });
};
