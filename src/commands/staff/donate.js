const { Client, Message, MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const Premium = require("../../utils/Schemas/Premium");

module.exports = {
    name: "donate",
    description: "Gives a user premium servers for donating.",
    usage: "donate <add/remove/set> <@user> <amount>",
    example: "donate add @Wumpus#0000 2",
    requiredPermissions: [],
    checks: [{
        check: (message) => message.member.roles.cache.has(config.discord.roles.admin),
        error: "You do not have permission to use this command."
    }, {
        check: (message, args) => ["add", "remove", "set"].includes(args[0]),
        error: "Wrong usage. Use `donate add/remove/set`."
    }, {
        check: (message, args) => args?.[1] !== undefined,
        error: "Please mention a user or provide a valid user ID."
    }, {
        check: (message, args) => !isNaN(args?.[2]),
        error: "Please provide a valid amount."
    }],
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {
        const action = args[0];
        const user = message.mentions.users.first() || client.users.cache.get(args[1]);
        const amount = parseInt(args[2]);

        if (!user) return message.channel.send("Please provide a valid user.");

        const premium = await Premium.findOne({ userId: user.id });

        const placeholders = {
            "{server_name}": message.guild.name,
            "{server_id}": message.guildId,
            "{user_name}": user.username,
            "{user_id}": user.id,
            "{user_ping}": user.toString(),
            "{amount}": amount
        }

        let msg = config.discord.messages.donated;

        for (const placeholder in placeholders) {
            msg = msg.replace(placeholder, placeholders[placeholder]);
        }

        const channel = message.guild.channels.cache.get(config.discord.channels.donations);

        if (action == "add") {
            if (!premium) {
                await Premium.create({
                    userId: user.id,
                    premiumCount: amount,
                    premiumUsed: 0
                });
            } else {
                await Premium.updateOne({ userId: user.id }, {
                    $inc: {
                        premiumCount: amount,
                        premiumUsed: 0
                    }
                });
            }
        } else if (action == "remove") {
            if (!premium) {
                await Premium.create({
                    userId: user.id,
                    premiumCount: 0,
                    premiumUsed: 0
                });
            } else {
                await Premium.updateOne({ userId: user.id }, {
                    $inc: {
                        premiumCount: -amount,
                        premiumUsed: 0
                    }
                });
            }
        } else if (action == "set") {
            if (!premium) {
                await Premium.create({
                    userId: user.id,
                    premiumCount: amount,
                    premiumUsed: 0
                });
            } else {
                await Premium.updateOne({ userId: user.id }, {
                    $set: {
                        premiumCount: amount
                    }
                });
            }
        }

        if (action !== "remove") {
            if (channel) {
                channel.send(msg);
            }

            message.channel.send(`Thank you ${placeholders["{user_ping}"]}, For Donating!`);
        }
    }
}