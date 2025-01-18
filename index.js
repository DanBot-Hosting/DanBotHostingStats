/*
    ____              ____        __     __  __           __  _
   / __ \____ _____  / __ )____  / /_   / / / /___  _____/ /_(_)___  ____ _
  / / / / __ `/ __ \/ __  / __ \/ __/  / /_/ / __ \/ ___/ __/ / __ \/ __ `/
 / /_/ / /_/ / / / / /_/ / /_/ / /_   / __  / /_/ (__  ) /_/ / / / / /_/ /
/_____/\__,_/_/ /_/_____/\____/\__/  /_/ /_/\____/____/\__/_/_/ /_/\__, /
Free Hosting forever!                                            /____/
*/

;(async () => {
    const fs = require("fs");
    const { QuickDB, MySQLDriver } = require("quick.db");
    const Discord = require("discord.js");
    const Sentry = require("@sentry/node");
    const { nodeProfilingIntegration } = require("@sentry/profiling-node");
 

    const Config = require("./config.json");

    //Starting MySQL Database, and global tables.
    const mysqlDriver = new MySQLDriver({
        host: Config.database.host,
        port: Config.database.port,
        user: Config.database.user,
        password: Config.database.pass,
        database: Config.database.db,
    });

    await mysqlDriver.connect();
    const db = new QuickDB({ driver: mysqlDriver });

    global.moment = require("moment");
    global.userData = db.table("userData"); //User data, Email, ConsoleID, Link time, Username, DiscordID
    global.nodeStatus = db.table("nodeStatus"); //Node status. Online or offline nodes
    global.userPrem = db.table("userPrem"); //Premium user data, Donated, Boosted, Total
    global.codes = db.table("redeemCodes"); //Premium server redeem codes...
    global.nodePing = db.table("nodePing"); //Node ping response time
    global.nodeStatus = db.table("nodeStatus"); //Status of the Node.
    global.nodeServers = db.table("nodeServers"); //Counts of servers on each Node.

    //Sentry.io Error Tracking.
    await Sentry.init({
        dsn: Config.SentryLogging.dsn,
        integrations: [
          nodeProfilingIntegration(),
        ],
        tracesSampleRate: 1.0, //  Capture 100% of the transactions.
    });

    module.exports.Sentry = Sentry;

    process.on("unhandledRejection", (Error) => Sentry.captureException(Error));

    //Discord Bot:
    const client = new Discord.Client({
        intents: [
            Discord.GatewayIntentBits.Guilds,
            Discord.GatewayIntentBits.GuildMembers,
            Discord.GatewayIntentBits.GuildModeration,
            Discord.GatewayIntentBits.GuildIntegrations,
            Discord.GatewayIntentBits.GuildPresences,
            Discord.GatewayIntentBits.GuildMessages,
            Discord.GatewayIntentBits.GuildMessageReactions,
            Discord.GatewayIntentBits.GuildMessageTyping,
            Discord.GatewayIntentBits.DirectMessages,
            Discord.GatewayIntentBits.DirectMessageReactions,
            Discord.GatewayIntentBits.DirectMessageTyping,
            Discord.GatewayIntentBits.MessageContent
        ],
        partials: [
            Discord.Partials.Channel,
            Discord.Partials.Message,
            Discord.Partials.Reaction
        ]
    });

    //Event Handler.
    fs.readdir("./src/events/", (err, files) => {
        files = files.filter((f) => f.endsWith(".js"));
        files.forEach((f) => {
            const event = require(`./src/events/${f}`);
            client.on(f.split(".")[0], event.bind(null, client));
            delete require.cache[require.resolve(`./src/events/${f}`)];
        });
    });

    //Server Creation:
    await require('./createData_Prem.js').initialStart();
    await require('./createData.js').initialStart();

    client.login(Config.DiscordBot.Token);
})();