const cap = require("../../util/cap");
const exec = require("child_process").exec;

const Config = require('../../../config.json');
const MiscConfigs = require('../../../config/misc-configs.js');

exports.description = "Aktualizuje bota z GitHuba. Komenda administracyjna.";

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

    console.log("Aktualizuję bota z GitHuba.");

    // Pulls the files from GitHub.
    exec(`git pull`, (error, stdout) => {
        let response = error || stdout;
        if (!error) {
            if (response.includes("Wszystko aktualne")) {
                message.reply("Pliki są aktualne.");
            } else {
                client.channels.cache
                    .get(MiscConfigs.github)
                    .send(
                        `<t:${Date.now().toString().slice(0, -3)}:f> Aktualizacja wywołana przez <@${message.author.id}>, pobieram pliki.\n\`\`\`${cap(response, 1900)}\`\`\``,
                    );

                message.reply("Pobieram pliki z GitHuba...");
                setTimeout(() => {
                    process.exit();
                }, 1000);
            }
        }
    });
};