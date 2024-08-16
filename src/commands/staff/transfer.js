const Discord = require("discord.js");

const Config = require('../../../config.json');
const MiscConfigs = require('../../../config/misc-configs.js');

exports.description = "Przenosi konto użytkownika i jego saldo na nowe konto.";

/**
 * Przenosi konto użytkownika i saldo na nowe konto.
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {

    if (!message.member.roles.cache.find((r) => r.id === Config.DiscordBot.Roles.Staff)) return;

    const modlog = message.guild.channels.cache.find(
        (channel) => channel.id === MiscConfigs.modLogs,
    );

    if (args.length < 3) {
        message.reply("Użycie: " + Config.DiscordBot.Prefix + "staff transfer <OLDUSERID> <NEWUSERID>.");
    } else {
        let old = userData.get(args[1]);

        if (old == null) {
            message.reply("To konto nie jest powiązane z kontem konsolowym :sad:");
        } else {
            if (!message.guild.members.cache.get(args[2])) {
                message.reply("Nie można znaleźć użytkownika o ID: " + args[2]);
                return;
            }

            let newData = userData.get(args[2]);

            if (!newData || old.consoleID != newData.consoleID) {
                message.reply(
                    "Oba konta muszą być powiązane z tym samym kontem panelu, aby ta komenda działała.",
                );
                return;
            }

            let { donated, used } = userPrem.get(args[1]) || {
                donated: 0,
                used: 0,
            };
            let newM = userPrem.get(args[2]) || {
                donated: 0,
                used: 0,
            };

            userPrem.set(args[2], {
                used: used + newM.used,
                donated: donated + newM.donated,
            });

            userPrem.delete(args[1]);

            message.reply("Gotowe!");

            if (modlog) {
                modlog.send({
                    embed: new Discord.MessageEmbed()
                        .setTitle("Transfer salda Premium")
                        .addField("Od:", args[1], true)
                        .addField("Do:", args[2], true)
                        .setDescription(`Dodano ${donated} kredytów i ${used} użytych`)
                        .setFooter("Wykonane przez: " + message.author.tag),
                });
            }
        }
    }
};