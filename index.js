/*
    ____              ____        __     __  __           __  _
   / __ \____ _____  / __ )____  / /_   / / / /___  _____/ /_(_)___  ____ _
  / / / / __ `/ __ \/ __  / __ \/ __/  / /_/ / __ \/ ___/ __/ / __ \/ __ `/
 / /_/ / /_/ / / / / /_/ / /_/ / /_   / __  / /_/ (__  ) /_/ / / / / /_/ /
/_____/\__,_/_/ /_/_____/\____/\__/  /_/ /_/\____/____/\__/_/_/ /_/\__, /
Free Hosting for ever!                                            /____/
*/

global.config = require("./config.json");
global.enabled = require("./enable.json")
const express = require('express');
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

//Main danbot.host app
const app = express();
const server = require('http').createServer(app);
const PORT = config.Port;
const hbs = require('hbs');
const favicon = require('serve-favicon');
const pat = require("path");
app.use(favicon(pat.join(__dirname, 'views', 'favicon.ico')))
const proxy = require('express-http-proxy');

//Animal API app
const animalapp = express();
const animalserver = require('http').createServer(animalapp);
const APIPORT = config.APIPort;
const apihbs = require('hbs');

const bodyParser = require('body-parser');
global.fs = require("fs");
global.chalk = require('chalk');
const nodemailer = require('nodemailer');
const axios = require('axios');
global.pretty = require('prettysize');
global.transport = nodemailer.createTransport({
  host: config.Email.Host,
  port: config.Email.Port,
  auth: {
    user: config.Email.User,
    pass: config.Email.Password
  }
});

const isSnowflake = require(process.cwd() + "/util/isSnowflake.js");
const { getBot } = require(process.cwd() + "/util/discordAPI");

// Initialising Node Checker
require('./nodestatsChecker');

//Discord Bot
global.puppeteer = require("puppeteer");
let db = require("quick.db");
global.Discord = require("discord.js");
global.fs = require("fs");
global.moment = require("moment");
global.userData = new db.table("userData");       //User data, Email, ConsoleID, Link time, Username, DiscordID
global.settings = new db.table("settings");       //Admin settings
global.webSettings = new db.table("webSettings"); //Web settings (forgot what this is even for)
global.mutesData = new db.table("muteData");      //Mutes, Stores current muted people and unmute times
global.domains = new db.table("linkedDomains");   //Linked domains for unproxy and proxy cmd
global.nodeStatus = new db.table("nodeStatus");   //Node status. Online or offline nodes
global.userPrem = new db.table("userPrem");       //Premium user data, Donated, Boosted, Total
global.nodeServers = new db.table("nodeServers"); //Server count for node limits to stop nodes becoming overloaded
global.client = new Discord.Client({
  disableEveryone: true
});
global.bot = client;
global.suggestionLog = new Discord.WebhookClient(config.DiscordSuggestions.channelID, config.DiscordSuggestions.channelID)
require('./bot/discord/commands/mute').init(client)
//Event handler
fs.readdir('./bot/discord/events/', (err, files) => {
  files = files.filter(f => f.endsWith('.js'));
  files.forEach(f => {
    const event = require(`./bot/discord/events/${f}`);
    client.on(f.split('.')[0], event.bind(null, client));
    delete require.cache[require.resolve(`./bot/discord/events/${f}`)];
  });
});

//Bot login
client.login(config.DiscordBot.Token);
global.Allowed = ["293841631583535106", "137624084572798976"];

//Music Stuffs
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
global.youtube = new YouTube(config.GoogleAPIKey);
global.queue = new Map();

//Animal API website
animalapp.use(helmet({
  frameguard: false
}));
animalapp.use(cookieParser());

animalapp.use(bodyParser.json());
animalapp.use(bodyParser.urlencoded({
  extended: true
}));

animalserver.listen(APIPORT, function () {
  console.log(chalk.magenta('[api.danbot.host] [WEB] ') + chalk.green("Listening on port " + APIPORT));
});

//View engine setup
apihbs.registerPartials(__dirname + '/animalAPI/views/partials')
animalapp.set('view engine', 'hbs');

animalapp.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST");

  console.log('[api.danbot.host] ' +
    (req.headers["cf-connecting-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.ip) +
    "[" +
    req.method +
    "] " +
    req.url
  );

  next();
});

animalapp.get('/', function (req, res) {
  res.send('hello!')
})

//Total images
const totalRoute = require("./animalAPI/total.js");
animalapp.use("/total", totalRoute);

//Dog API
const dogRoute = require("./animalAPI/dog.js");
animalapp.use("/dog", dogRoute);

//Cat API
const catRoute = require("./animalAPI/cat.js");
animalapp.use("/cat", catRoute);

//DanBot.host website
const passport = require("passport");
const session = require("express-session");
const strategy = require("passport-discord").Strategy;
const MongoStore = require("connect-mongo")(session);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new strategy({
      clientID: config.DiscordBot.clientID,
      clientSecret: config.DiscordBot.clientSecret,
      callbackURL: config.DiscordBot.callbackURL,
      scope: ["identify"]
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        return done(null, profile);
      });
    }
  )
);

app.use(
  session({
    store: new MongoStore({
      url: config.DB.MongoDB
    }),
    secret: "FROPT",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(helmet({
  frameguard: false
}));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

server.listen(PORT, function () {
  console.log(chalk.magenta('[danbot.host] [WEB] ') + chalk.green("Listening on port " + PORT));
});

//Fetch node data
global.nodeData = new db.table("nodeData")
setInterval(() => {
  for (i = 1; i < 15; i++) {
    axios({
      url: "http://n" + i + ".danbot.host:999/stats",
      method: 'GET',
      followRedirect: true,
      maxRedirects: 5,
      headers: {
        "password": config.externalPassword
      },
      }).then(response => {
        nodeData.set(response.data.info.servername, {
          servername: response.data.info.servername,
          cpu: response.data.info.cpu,
          cpuload: response.data.info.cpuload,
          cputhreads: response.data.info.cputhreads,
          cpucores: response.data.info.cpucores,
          memused: response.data.info.memused,
          memtotal: response.data.info.memtotal,
          memusedraw: response.data.info.memusedraw,
          memtotalraw: response.data.info.memtotalraw,
          swapused: response.data.info.swapused,
          swaptotal: response.data.info.swaptotal,
          swapusedraw: response.data.info.swapusedraw,
          swaptotalraw: response.data.info.swaptotalraw,
          diskused: response.data.info.diskused,
          disktotal: response.data.info.disktotal,
          diskusedraw: response.data.info.diskusedraw,
          disktotalraw: response.data.info.disktotalraw,
          netrx: response.data.info.netrx,
          nettx: response.data.info.nettx,
          osplatform: response.data.info.osplatform,
          oslogofile: response.data.info.oslogofile,
          osrelease: response.data.info.osrelease,
          osuptime: response.data.info.osuptime,
          biosvendor: response.data.info.biosvendor,
          biosversion: response.data.info.biosversion,
          biosdate: response.data.info.biosdate,
          servermonitorversion: response.data.info.servermonitorversion,
          datatime: response.data.info.datatime,
          dockercontainers: response.data.info.dockercontainers,
          dockercontainersrunning: response.data.info.dockercontainersrunning,
          dockercontainerspaused: response.data.info.dockercontainerspaused,
          dockercontainersstopped: response.data.info.dockercontainersstopped,
          updatetime: response.data.info.updatetime
        });
        nodeData.set(response.data.speedtest.speedname + '-speedtest', {
          speedname: response.data.speedtest.speedname,
          ping: response.data.speedtest.ping,
          download: response.data.speedtest.download,
          upload: response.data.speedtest.upload,
          updatetime: response.data.speedtest.updatetime
        });
        nodeData.set(response.data.info.servername + '-docker', {
          dockerAll: response.data.docker
        })
      }).catch(err => {

    })
  }
}, 2000)

//View engine setup
hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST");

  console.log('[danbot.host] ' +
    (req.headers["cf-connecting-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.ip) +
    "[" +
    req.method +
    "] " +
    req.url
  );

  next();
});

//Routes


// DanBot Hosting Stats

const apiRoute = require("./routes/api.js");
const botRoute = require("./routes/bot.js");
const indexRoute = require("./routes/index.js");
const statsRoute = require("./routes/stats.js");
const meRoute = require("./routes/me.js");
const adminRoute = require("./routes/admin.js");
const externalRoute = require("./routes/external.js");
//const { config } = require("process");

app.use("/api", apiRoute);
app.use("/bot", botRoute);
app.use("/", indexRoute);
app.use("/stats", statsRoute);
app.use("/me", meRoute);
app.use("/admin", adminRoute);
app.use("/external", externalRoute);

app.get('/arc-sw.js', (req, res) => {
  res.sendFile('./util//arc-sw.js', { root: __dirname });
});

app.get("/user/:ID", async (req, res) => {
  let user = req.params.ID;
  let memberr = "No"

  if (!isSnowflake(user)) {
    return res.render("error.ejs", {
      user: req.isAuthenticated() ? req.user : null,
      message: "Make sure ID is a valid ID"
    });
  }

  let [use] = await getBot(user)

  if (use.user_id && use.user_id[0].endsWith("is not snowflake."))
    return res.render("error.ejs", {
      user: req.isAuthenticated() ? req.user : null,
      message: "ID is invalid"
    });

  if (use.message === "Unknown User")
    return res.render("error.ejs", {
      user: req.isAuthenticated() ? req.user : null,
      message: "Discord API - Unknown User"
    });

  if (use.bot === true) return res.redirect("/bot/" + user);

  try {
    bot.users.fetch(user).then(User => {
      if (User.bot) {
        return res.redirect("/bot/" + User.id);
      }

      var member = bot.guilds.cache.get("639477525927690240").members.cache.get(User.id);
      if (!member) {
        (pColor = "grey"), (presence = "offline");
      }
      let guild = bot.guilds.cache.get("639477525927690240");
      if (guild.member(User.id)) {
        memberr = "yes";
      }
      if (member) {
        presence = member.presence.status;

        if (presence) {
          if (presence === "offline") {
            presence = "Offline";
            pColor = "grey";
          } else if (presence === "online") {
            presence = "Online";
            pColor = "#43B581";
          } else if (presence === "dnd") {
            presence = "DND";
            pColor = "#F04747";
          } else if (presence === "streaming") {
            presence = "Streaming";
            pColor = "purple";
          } else if (presence === "idle") {
            presence = "Idle";
            pColor = "#FAA61A";
          } else {
            (pColor = "grey"), (presence = "Not Available");
          }
        }
      }

      let avatar = member.user.avatarURL();

      let bots = db.get(`${User.id}.bots`);
      if (!bots) bots = null;

      // console.log(avatar);
      // console.log(bots);

      res.render("me/user.ejs", {
        user: req.isAuthenticated() ? req.user : null,
        User,
        avatar,
        //  Data,
        pColor,
        presence,
        //    info,
        memberr,
        use,
        bots,
        db,
        //  Discord,
        //    pageType: { user: true }
      });
    });
  } catch (e) {
    return res.render("error.ejs", {
      user: req.isAuthenticated() ? req.user : null,
      message: e
    });
  }

});


//Catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).render("error.ejs", {
    message: "Page Not Found",
    user: req.isAuthenticated() ? req.user : null
  });
});
