/*
    ____              ____        __     __  __           __  _            
   / __ \____ _____  / __ )____  / /_   / / / /___  _____/ /_(_)___  ____ _
  / / / / __ `/ __ \/ __  / __ \/ __/  / /_/ / __ \/ ___/ __/ / __ \/ __ `/
 / /_/ / /_/ / / / / /_/ / /_/ / /_   / __  / /_/ (__  ) /_/ / / / / /_/ / 
/_____/\__,_/_/ /_/_____/\____/\__/  /_/ /_/\____/____/\__/_/_/ /_/\__, /  
Free Hosting for ever!                                            /____/   
*/

global.config = require("./config.json");
var express = require('express');
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

//Main danbot.host app
var app = express();
var server = require('http').createServer(app);
var PORT = config.Port;
const hbs = require('hbs');

//Animal API app
var animalapp = express();
var animalserver = require('http').createServer(animalapp);
var APIPORT = config.APIPort;
const apihbs = require('hbs');

var bodyParser = require('body-parser');
global.fs = require("fs");
global.chalk = require('chalk');
const nodemailer = require('nodemailer');
const axios = require('axios');
var ping = require('ping');
const ping2 = require('ping-tcp-js')
global.transport = nodemailer.createTransport({
  host: config.Email.Host,
  port: config.Email.Port,
  auth: {
    user: config.Email.User,
    pass: config.Email.Password
  }
});

const isSnowflake = require(process.cwd() + "/util/isSnowflake.js");
const {
  getUser,
  getBot
} = require(process.cwd() + "/util/discordAPI");


//Node status 
setInterval(() => {
  //Node 1
  axios({
    url: config.Pterodactyl.hosturl + "/api/client/servers/99d65091/resources",
    method: 'GET',
    followRedirect: true,
    maxRedirects: 5,
    headers: {
      'Authorization': 'Bearer ' + config.Pterodactyl.apikeyclient,
      'Content-Type': 'application/json',
      'Accept': 'Application/vnd.pterodactyl.v1+json',
    }
  }).then(response => {
    nodeStatus.set("node1", {
      status: "Online 🟢"
    });
  }).catch(error => {
    nodeStatus.set("node1", {
      status: "Offline 🔴"
    });
  })

  //Node 2
  axios({
    url: config.Pterodactyl.hosturl + "/api/client/servers/0cb9a74e/resources",
    method: 'GET',
    followRedirect: true,
    maxRedirects: 5,
    headers: {
      'Authorization': 'Bearer ' + config.Pterodactyl.apikeyclient,
      'Content-Type': 'application/json',
      'Accept': 'Application/vnd.pterodactyl.v1+json',
    }
  }).then(response => {
    nodeStatus.set("node2", {
      status: "Online 🟢"
    });
  }).catch(error => {
    nodeStatus.set("node2", {
      status: "Offline 🔴"
    });
  })

  //Node 3
  axios({
    url: config.Pterodactyl.hosturl + "/api/client/servers/373fafce/resources",
    method: 'GET',
    followRedirect: true,
    maxRedirects: 5,
    headers: {
      'Authorization': 'Bearer ' + config.Pterodactyl.apikeyclient,
      'Content-Type': 'application/json',
      'Accept': 'Application/vnd.pterodactyl.v1+json',
    }
  }).then(response => {
    nodeStatus.set("node3", {
      status: "Online 🟢"
    });
  }).catch(error => {
    nodeStatus.set("node3", {
      status: "Offline 🔴"
    });
  })

  //Node 4
  axios({
    url: config.Pterodactyl.hosturl + "/api/client/servers/98ca4dbd/resources",
    method: 'GET',
    followRedirect: true,
    maxRedirects: 5,
    headers: {
      'Authorization': 'Bearer ' + config.Pterodactyl.apikeyclient,
      'Content-Type': 'application/json',
      'Accept': 'Application/vnd.pterodactyl.v1+json',
    }
  }).then(response => {
    nodeStatus.set("node4", {
      status: "Online 🟢"
    });
  }).catch(error => {
    nodeStatus.set("node4", {
      status: "Offline 🔴"
    });
  })

  //Node 5
  axios({
    url: config.Pterodactyl.hosturl + "/api/client/servers/97e64d11/resources",
    method: 'GET',
    followRedirect: true,
    maxRedirects: 5,
    headers: {
      'Authorization': 'Bearer ' + config.Pterodactyl.apikeyclient,
      'Content-Type': 'application/json',
      'Accept': 'Application/vnd.pterodactyl.v1+json',
    }
  }).then(response => {
    nodeStatus.set("node5", {
      status: "Online 🟢"
    });
  }).catch(error => {
    nodeStatus.set("node5", {
      status: "Offline 🔴"
    });
  })

  //Node 7
  axios({
    url: config.Pterodactyl.hosturl + "/api/client/servers/94082df3/resources",
    method: 'GET',
    followRedirect: true,
    maxRedirects: 5,
    headers: {
      'Authorization': 'Bearer ' + config.Pterodactyl.apikeyclient,
      'Content-Type': 'application/json',
      'Accept': 'Application/vnd.pterodactyl.v1+json',
    }
  }).then(response => {
    nodeStatus.set("node7", {
      status: "Online 🟢"
    });
  }).catch(error => {
    nodeStatus.set("node7", {
      status: "Offline 🔴"
    });
  })

  //Node 1 (PRIVATE ADMIN PANEL)
  axios({
    url: config.PrivPterodactyl.hosturl + "/api/client/servers/88a20baf/resources",
    method: 'GET',
    followRedirect: true,
    maxRedirects: 5,
    headers: {
      'Authorization': 'Bearer ' + config.PrivPterodactyl.apikeyclient,
      'Content-Type': 'application/json',
      'Accept': 'Application/vnd.pterodactyl.v1+json',
    }
  }).then(response => {
    nodeStatus.set("node1-priv", {
      status: "Online 🟢"
    });
  }).catch(error => {
    nodeStatus.set("node1-priv", {
      status: "Offline 🔴"
    });
  })

  var hosts = ['154.27.68.234', 'panel.danbot.host', 'mail.danbot.host', 'api.danbot.host'];
  hosts.forEach(function (host) {
    ping.sys.probe(host, function (isAlive) {
      if (isAlive == true) {
        nodeStatus.set(host, {
          status: "Online 🟢"
        })
      } else if (isAlive == false) {
        nodeStatus.set(host, {
          status: "Offline 🔴"
        });
      }
    });
  }, {
    timeout: 4
  });

  const portz = 2333;

  //Lavalink Server 1
  const hostz = 'lava.danbot.host';
  ping2
    .ping(hostz, portz)
    .then(() => nodeStatus.set("lava.danbot.host", {
      status: "Online 🟢"
    }))
    .catch((e) => nodeStatus.set("lava.danbot.host", {
      status: "Offline 🔴"
    }));

  //Lavalink Server 2
  const hostz2 = 'lava2.danbot.host';
  ping2
    .ping(hostz2, portz)
    .then(() => nodeStatus.set("lava2.danbot.host", {
      status: "Online 🟢"
    }))
    .catch((e) => nodeStatus.set("lava2.danbot.host", {
      status: "Offline 🔴"
    }));

}, 2500)


//Discord Bot
let db = require("quick.db");
global.Discord = require("discord.js");
global.fs = require("fs");
global.moment = require("moment");
global.userData = new db.table("userData");
global.settings = new db.table("settings");
global.webSettings = new db.table("webSettings");
global.mutesData = new db.table("muteData");
global.domains = new db.table("linkedDomains");
global.nodeStatus = new db.table("nodeStatus");
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
global.Allowed = ["338192747754160138", "137624084572798976"];


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
const csrf = require("csurf");

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
  for (i = 1; i < 8; i++) {
    axios({
      url: "http://n" + i + ".danbot.host:999/stats",
      method: 'GET',
      followRedirect: true,
      maxRedirects: 5,
      }).then(response => {
        nodeData.set(response.data.info.servername, {
          servername: response.data.info.servername,
          cpu: response.data.info.cpu,
          cpuload: response.data.info.cpuload,
          cputhreads: response.data.info.cputhreads,
          cpucores: response.data.info.cpucores,
          memused: response.data.info.memused,
          memtotal: response.data.info.memtotal,
          swapused: response.data.info.swapused,
          swaptotal: response.data.info.swaptotal,
          diskused: response.data.info.diskused,
          disktotal: response.data.info.disktotal,
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
      }).catch(error => {
        //Do nothing, Node is down
      })
  }
}, 2000)

app.get('/ads.txt', function (req, res) {
  res.send("google.com, pub-1419536702363407, DIRECT, f08c47fec0942fa0");
})

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

  if (use.message == "Unknown User")
    return res.render("error.ejs", {
      user: req.isAuthenticated() ? req.user : null,
      message: "Discord API - Unknown User"
    });

  if (use.bot === true) return res.redirect("/bot/" + user);

  try {
    bot.fetchUser(user).then(User => {
      if (User.bot) {
        return res.redirect("/bot/" + User.id);
      }

      var member = bot.guilds
        .get("639477525927690240")
        .members.get(User.id);
      if (!member) {
        (pColor = "grey"), (presence = "offline");
      }
      let guild = bot.guilds.get("639477525927690240");
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

      let avatar = `https://bots.idledev.org/bot/${user}/avatar`;

      let bots = db.get(`${User.id}.bots`);
      if (!bots) bots = null;

      console.log(bots)

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

setInterval(async () => {
  console.log("[Automatic Process] Getting bot stats from MBL")
  require("./util/MBL.js")
}, 600000);