/*
    ____              ____        __     __  __           __  _            
   / __ \____ _____  / __ )____  / /_   / / / /___  _____/ /_(_)___  ____ _
  / / / / __ `/ __ \/ __  / __ \/ __/  / /_/ / __ \/ ___/ __/ / __ \/ __ `/
 / /_/ / /_/ / / / / /_/ / /_/ / /_   / __  / /_/ (__  ) /_/ / / / / /_/ / 
/_____/\__,_/_/ /_/_____/\____/\__/  /_/ /_/\____/____/\__/_/_/ /_/\__, /  
Free Hosting for ever!                                            /____/   
*/

global.config = require("./config.json");
var PORT = config.Port;
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
global.fs = require("fs");
const hbs = require('hbs');
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

var hosts = ['154.27.68.234', 'panel.danbot.host', 'mail.danbot.host'];
hosts.forEach(function(host){
  ping.sys.probe(host, function(isAlive){
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
}, { timeout: 4 });

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

}, 5000)


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

bot.on("voiceStateUpdate", async (newM, oldM) => {
  let guild = newM.guild;
  try {
      guild.channels.get('757029522682937354').send((oldM == newM ? `${oldM.displayName}: ${oldM.voiceChannelID} = ${newM.voiceChannelID}` : `${oldM.displayName}: ${oldM.voiceChannelID} -> ${newM.voiceChannelID}`))
  } catch (error) {
      guild.channels.get('757029522682937354').send(error.name)
  }
  if (oldM.voiceChannelID == newM.voiceChannelID) return;


  if (oldM.voiceChannel != null && oldM.voiceChannelID != "757660050977456238" && oldM.voiceChannel.parentID == "757659750342197289") {
      if (client.pvc.get(oldM.voiceChannelID) != null && client.pvc.get(oldM.voiceChannelID).owner == oldM.id) {
          console.log("delete")

          oldM.voiceChannel.delete();
          client.pvc.delete(oldM.voiceChannelID);
      }
  }

  if (newM.voiceChannelID == "757660050977456238") {
      console.log("create")
      let cleanName = transliterate.slugify(newM.user.username);
      if (cleanName == '') cleanName = 'unknown';
      let vc = await guild.createChannel(`${cleanName}'s Room`, {
          type: "voice",
          permissionOverwrites: [{
              id: guild.id,
              deny: ["CONNECT", "VIEW_CHANNEL"]
          }, {
              id: newM.id,
              allow: ["SPEAK", "STREAM", "CONNECT", "VIEW_CHANNEL"]
          }]
      })
      vc.setParent("757659750342197289");
      newM.setVoiceChannel(vc.id);
      client.pvc.set(vc.id, {
          channelID: vc.id,
          owner: newM.id
      })
  }
})

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

//Test Email
//const message = {
//  from: config.Email.From,
//  to: 'danielpd93@gmail.com',
//  subject: 'DanBot Hosting Webpage and Discord Bot now online!',
//  html: "DanBot Hosting Stats page is now online!"
//};
//transport.sendMail(message, function(err, info) {
//  if (err) {
//    console.log(err)
//  } else {
//    console.log(info);
//  }
//});

// website things

const passport = require("passport");
const session = require("express-session");
const strategy = require("passport-discord").Strategy;
const MongoStore = require("connect-mongo")(session);
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const helmet = require("helmet");

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
  console.log(chalk.magenta('[WEB] ') + chalk.green("Listening on port " + PORT));
});

global.nodeData = new db.table("nodeData")
app.get('/data', function (req, res) {
  let nodes = ["154.27.68.232", "154.27.68.233", "167.86.113.158", "51.38.69.73"];
  if (req.query.servername == undefined) {
    if (!nodes.includes(req.headers["x-forwarded-for" || "cf-connecting-ip"])) {
      res.redirect("/")
    } else {
      nodeData.set(req.query.speedname + '-speedtest', {
        speedname: req.query.speedname,
        ping: req.query.ping,
        download: req.query.download,
        upload: req.query.upload,
        updatetime: req.query.updatetime
      });
    };
  } else {
    if (!nodes.includes(req.headers["x-forwarded-for" || "cf-connecting-ip"])) {
      res.redirect("/")
    } else {
      nodeData.set(req.query.servername, {
        servername: req.query.servername,
        cpu: req.query.cpu,
        cpuload: req.query.cpuload,
        cputhreads: req.query.cputhreads,
        cpucores: req.query.cpucores,
        memused: req.query.memused,
        memtotal: req.query.memtotal,
        swapused: req.query.swapused,
        swaptotal: req.query.swaptotal,
        diskused: req.query.diskused,
        disktotal: req.query.disktotal,
        netrx: req.query.netrx,
        nettx: req.query.nettx,
        osplatform: req.query.osplatform,
        oslogofile: req.query.oslogofile,
        osrelease: req.query.osrelease,
        osuptime: req.query.osuptime,
        biosvendor: req.query.biosvendor,
        biosversion: req.query.biosversion,
        biosdate: req.query.biosdate,
        servermonitorversion: req.query.servermonitorversion,
        datatime: req.query.datatime,
        dockercontainers: req.query.dockercontainers,
        dockercontainersrunning: req.query.dockercontainersrunning,
        dockercontainerspaused: req.query.dockercontainerspaused,
        dockercontainersstopped: req.query.dockercontainersstopped,
        updatetime: req.query.updatetime
      });
    }
  }
})

//View engine setup
hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST");

  console.log(
    (req.headers["cf-connecting-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.ip) +
    " [" +
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
//const { config } = require("process");

app.use("/api", apiRoute);
app.use("/bot", botRoute);
app.use("/", indexRoute);
app.use("/stats", statsRoute);
app.use("/me", meRoute);
app.use("/admin", adminRoute);

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

      let avatar = `https://mythicalbots.xyz/bot/${user}/avatar`;

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