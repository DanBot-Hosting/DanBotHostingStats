const config = require("../../config.json");
const { Client, Message, MessageEmbed } = require("discord.js");
const UserSchema = require("../../utils/Schemas/User");
const getEgg = require("../../utils/pterodactyl/server/getEgg");
const createServer = require("../../utils/pterodactyl/server/createServer");

module.exports = {
    name: "create",
    description: "Create a new server.",
    usage: "create <type> [name]",
    example: "create NodeJS Example",
    requiredPermissions: [],
    checks: [{
        check: () => config.discord.commands.serverCommandsEnabled,
        error: "The server commands are disabled!"
    }],
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const user = await UserSchema.findOne({ userId: message.author.id });

        if (!user) {
            message.reply("You are not linked to a panel account.");
            return;
        }

        const type = args[0];
        if (!args) return message.reply('Please specify a server type.')

        const name = args?.slice(1)?.join(" ") || "change me! (Settings -> SERVER NAME)";

        const serverType = config.pterodactyl.serverCreationData.find(st => st.name.toLowerCase() === type.toLowerCase());

        if (!serverType) {
            const embed = new MessageEmbed()
                .setTitle("Invalid Server Types")
                .setDescription(`${config.pterodactyl.serverCreationData.map(st => `\`${st.name}\` - \`${st.description}\``).join(", ")}`)
                .setTimestamp()

            message.reply({
                embeds: [embed]
            })

            return;
        }

        const eggData = await getEgg(serverType.nestId, serverType.eggId);

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
                "locations": serverType.gaming ? config.pterodactyl.freeGamingNodes : config.pterodactyl.freeNodes,
                "dedicated_ip": false,
                "port_range": []
            },
            "start_on_completion": false
        }

        const serverData = await createServer(serverCreationData);

        if (serverData.error) {
            const embed = new MessageEmbed()
                .setTitle("Failed to create server")
                .setDescription(`Failed to Create the server, Please contact a staff member.`)

            message.reply({
                embeds: [embed]
            })

            return;
        }

        const embed = new MessageEmbed()
            .setTitle("Server Created")
            .setDescription(`Server created successfully!`)
            .addField("Name", `\`${serverData.data.attributes.name.toString()}\``)
            .addField("ID", `\`${serverData.data.attributes.identifier.toString()}\``)
            .addField("Type", `\`${type.toString()}\``)
            .setColor("GREEN")
            .setTimestamp()

        message.reply({
            embeds: [embed]
        })

        return;
    }
}