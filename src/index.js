const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const config = require("./config.json");
const PterodactylCache = require("./utils/cache");
const commandLoader = require("./utils/commandLoader");
const eventLoader = require("./utils/eventLoader");

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessageReactions
    ],
    allowedMentions: {
        parse: ["users", "roles"],
    },
    partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User],
})

client.commands = new Collection();
client.cache = new PterodactylCache(client, config.redis);

commandLoader(client);
eventLoader(client);

process.on("unhandledRejection", err => {
    console.error("Unhandled promise rejection", err);
})

process.on("uncaughtException", err => {
    console.error("Uncaught exception", err);
})

client.login(config.bot.token);
