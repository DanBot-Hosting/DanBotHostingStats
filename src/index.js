const { Client, Collection, Intents } = require("discord.js");
const config = require("./config.json");
const PterodactylCache = require("./utils/cache");
const commandLoader = require("./utils/commandLoader");
const eventLoader = require("./utils/eventLoader");

const client = new Client({
    intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ],
    allowedMentions: {
        parse: ["users", "roles"],
    },
    partials: ["MESSAGE", "CHANNEL", "REACTION", "USER"],
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