const Discord = require("discord.js");
const fs = require('fs');
const path = require('path');

const cap = require("../util/cap");
const Config = require('../../config.json');
const MiscConfigs = require('../../config/misc-configs.js');

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @returns void
 */
module.exports = async (client, message) => {

    //Add reactions to suggestion channels.
    if (MiscConfigs.suggestionChannels.some((channel) => channel == message.channel.id)) {
        if (!message.content.startsWith(">")) {
            await message.react("👍");
            await message.react("👎");
        }
    }


    // Staff that can invoke the bot for DMs.
    if (message.channel.type === "dm") {
        // Allow users to send messages on behalf of the bot if they are allowed
        if (MiscConfigs.dmAllowedUsers.includes(message.author.id)) {
            const args = message.content.trim().split(/ +/g);

            try {
                const msg = await client.channels.cache
                    .get(args[0])
                    .send(cap(message.content.split(" ").slice(1).join(" "), 2000));
                message.reply(msg.url);
            } catch (err) {
                message.channel.send(`\`\`\`${err.message}\`\`\``);
            }
        }
    };

    if (message.author.bot) return; // Stop bots from running commands.
    if (message.channel.type === "dm") return; // Stop commands in DMs.

    const prefix = Config.DiscordBot.Prefix;
    if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandargs = message.content.split(" ").slice(1).join(" ");
    const command = args.shift().toLowerCase();

    console.log(
        chalk.magenta("[DISCORD] ") +
            chalk.yellow(
                `[${message.author.username}] [${message.author.id}] >> ${prefix}${command} ${commandargs}`,
            ),
    );

    try {

        //Checks if the command is allowed in the channel or category.
        //Staff bypass channel requirements.
        if (
            !MiscConfigs.allowedChannels.includes(message.channel.id) &&                            //Channel is not present in allowedChannels.
            !MiscConfigs.allowedCategories.includes(message.channel.parentID) &&                    //Channel is not in allowed category.
            !message.member.roles.cache.find((x) => x.id === Config.DiscordBot.Roles.Staff) &&      //Making sure the user isn't staff.
            !message.member.roles.cache.find((x) => x.id === Config.DiscordBot.Roles.BotAdmin)      //Making sure the user isn't a bot Administrator.
        ) return;

        const categoriesPath = path.join(__dirname, '../commands');
        const categories = fs.readdirSync(categoriesPath).filter(x => fs.statSync(path.join(categoriesPath, x)).isDirectory());

        if (categories.includes(command)) {
            if (!args[0]) {
                let commandFile = require(`../commands/${command}/help.js`);
                await commandFile.run(client, message, args);
            } else {
                let commandFile = require(`../commands/${command}/${args[0]}.js`);
                await commandFile.run(client, message, args);
            }
        } else {
            let commandFile = require(`../commands/${command}.js`);
            await commandFile.run(client, message, args);
        }
    } catch (Error) {
        if (!Error.message.startsWith("Cannot find module")) {
            console.log("Error loading module:", Error);
        }
    }
};
