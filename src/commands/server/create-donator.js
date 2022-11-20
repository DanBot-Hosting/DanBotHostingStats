const config = require("../../config.json");
const serverConfig = require("../../server-config.json")
const { Client, Message, EmbedBuilder, Colors } = require("discord.js");
const UserSchema = require("../../utils/Schemas/User");
const Premium = require("../../utils/Schemas/Premium");
const Pterodactyl = require('../../utils/pterodactyl/index');
const ptero = new Pterodactyl();

module.exports = {
    name: "create-donator",
    description: "Create a Donator new server.",
    usage: "create-donator <type> [name]",
    example: "create-donator NodeJS Example",
    requiredPermissions: [],
    checks: [{
        check: () => config.discord.commands.serverCommandsEnabled,
        error: "The server commands are disabled!"
    }, {
        check: (message, args) => args.length >= 1,
        error: "You must specify a type!"
    }],
    cooldown: 30000,
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const premiumData = await Premium.findOne({ userId: message.author.id });

        if (!premiumData) {
            message.reply("You are not a donator");
            return;
        }

        if (premiumData.premiumCount <= premiumData.premiumUsed) {
            message.reply("You have used all of your premium servers.");
            return;
        }

        const user = await UserSchema.findOne({ userId: message.author.id });

        if (!user) {
            message.reply("You are not linked to a panel account.");
            return;
        }

        const type = args[0];

        const name = args?.slice(1)?.join(" ") || "change me! (Settings -> SERVER NAME)";

        const serverType = serverConfig.serverCreationData.find(st => st.name.toLowerCase() === type.toLowerCase());

        if (!serverType) {
            const embed = new EmbedBuilder()
                .setTitle("Invalid Server Types")
                .setDescription(`${serverConfig.serverCreationData.map(st => `\`${st.name}\` - \`${st.description}\``).join(", ")}`)
                .setTimestamp()

            message.reply({
                embeds: [embed]
            })

            return;
        }

        const eggData = await ptero.eggs.getEgg(serverType.nestId, serverType.eggId);

        const envs = {}

        for (let i = 0; i < eggData.attributes.relationships.variables.data.length; i++) {
            const eggd = eggData.attributes.relationships.variables.data[i];

            envs[eggd.attributes.env_variable] = eggd.attributes.default_value;
        }

        const serverCreationData = {
            "name": name,
            "user": user.consoleId,
            "egg": serverType.eggId,
            "docker_image": eggData.attributes.docker_image,
            "startup": eggData.attributes.startup,
            "limits": {
                "memory": serverType.ram,
                "swap": serverType.swap,
                "disk": serverType.disk,
                "io": serverType.io,
                "cpu": serverType.cpu
            },
            "environment": envs,
            "feature_limits": {
                "databases": serverType.databases,
                "allocations": serverType.allocations,
                "backups": serverType.backups,
            },
            "deploy": {
                "locations": serverType.gaming ? serverConfig.donatorGamingNodes : serverConfig.donatorNodes,
                "dedicated_ip": false,
                "port_range": []
            },
            "start_on_completion": false
        }


        await Premium.updateOne({ userId: message.author.id }, { $inc: { premiumUsed: 1 } });

        const serverData = await ptero.server.createServer(serverCreationData);

        if (serverData.error) {

            await Premium.updateOne({ userId: message.author.id }, { $inc: { premiumUsed: -1 } });

            const embed = new EmbedBuilder()
                .setTitle("Failed to create server")
                .setDescription(`Failed to Create the server, Please contact a staff member.`)
                .setFooter({
                    text: "You've been given back your premium server."
                })
            message.reply({
                embeds: [embed]
            })

            return;
        }

        const embed = new EmbedBuilder()
            .setTitle("Server Created")
            .setDescription(`Server created successfully!`)
            .addFields(
                { name: "Name", value: `\`${serverData.data.attributes.name.toString()}\`` },
                { name: "ID", value: `\`${serverData.data.attributes.identifier.toString()}\`` },
                { name: "Type", value: `\`${type.toString()}\`` }
            )
            .setColor(Colors.Green)
            .setTimestamp()

        message.reply({
            embeds: [embed]
        })

        const userPremium = await Premium.findOne({ userId: message.author.id });

        const logEmbed = new EmbedBuilder()
            .setTitle("Donator Server Created")
            .setDescription(`Server **${serverData.data.attributes.name}** has been created.`)
            .addFields(
                { name: "Server ID", value: serverData.data.attributes.id.toString() },
                { name: "Server Name", value: serverData.data.attributes.name.toString() },
                { name: "Server Creator", value: message.author.tag }
            )
            .setFooter({
                text: `User has ${userPremium.premiumUsed}/${userPremium.premiumCount} premium servers used.`
            })
            .setTimestamp()

        const chan = message.guild.channels.cache.get(config.discord.channels.serverLogs);

        if (chan) {
            chan.send({
                embeds: [logEmbed]
            })
        }

        return;
    }
}
