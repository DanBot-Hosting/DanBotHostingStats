/* _____                                __  __                _  _               
  / ____|                              |  \/  |              (_)| |              
 | (___    ___  _ __ __   __ ___  _ __ | \  / |  ___   _ __   _ | |_  ___   _ __ 
  \___ \  / _ \| '__|\ \ / // _ \| '__|| |\/| | / _ \ | '_ \ | || __|/ _ \ | '__|
  ____) ||  __/| |    \ V /|  __/| |   | |  | || (_) || | | || || |_| (_) || |   
 |_____/  \___||_|     \_/  \___||_|   |_|  |_| \___/ |_| |_||_| \__|\___/ |_|  
 Free Monitoring software made by danielpmc                                                      
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
let transport = nodemailer.createTransport({
  host: config.Email.Host,
  port: config.Email.Port,
  auth: {
     user: config.Email.User,
     pass: config.Email.Password
  }
});


//Discord Bot
var node = require('nodeactyl-beta');
global.DanBotHosting = node.Application;
global.DanBotHostingClient = node.Client;
global.Discord = require("discord.js");
const client = new Discord.Client()
global.fs = require("fs");
global.moment = require("moment");
let db = require("quick.db");
global.userData = new db.table("userData")

//Event handler
fs.readdir('./bot/discord/events/', (err, files) => {
  files = files.filter(f => f.endsWith('.js'));
  files.forEach(f => {
      const event = require(`./bot/discord/events/${f}`);
      client.on(f.split('.')[0], event.bind(null, client));
      delete require.cache[require.resolve(`./bot/discord/events/${f}`)];
    });
  }); 

//Disconnected from discord. Probs time to restart while disconnected.
//client.on('reconnecting', () => console.log('Disconnected from discord. Restarting...'), process.exit());

//Logging into pterodactyl using Nodeactyl
DanBotHosting.login(config.Pterodactyl.hosturl, config.Pterodactyl.apikey, (logged_in) => {
  console.log(chalk.magenta('[APP] ') + chalk.green("Nodeactyl logged in? " + logged_in));
});
DanBotHostingClient.login(config.Pterodactyl.hosturl, config.Pterodactyl.apikeyclient, (logged_in) => {
  console.log(chalk.magenta('[CLIENT] ') + chalk.green("Nodeactyl logged in? " + logged_in));
});

//Bot login
client.login(config.DiscordBot.Token);

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


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

server.listen(PORT, function () {
    console.log(chalk.magenta('[WEB] ') + chalk.green("Listening on port " + PORT));
});

app.get('/data', function (req, res) {
  if (req.query.servername == undefined) {
    var data = JSON.stringify(req.query);
    fs.writeFileSync('data/' + req.query.speedname + '-speedtest.json', data);
  } else {
    var data = JSON.stringify(req.query);
    fs.writeFileSync('data/' + req.query.servername + '.json', data);
  }
});

//View engine setup
hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

//Routes
app.get("/", (req, res) => {

  //Data for node 1
  var N1 = fs.readFileSync('./data/0286b2ad-dc80-4b5c-a0de-b81945b010e8.json', 'utf8');
  var Node1 = JSON.parse(N1);
  var N1speed = fs.readFileSync('./data/0286b2ad-dc80-4b5c-a0de-b81945b010e8-speedtest.json', 'utf8');
  var Node1speed = JSON.parse(N1speed);

  //Data for node 2
  var N2 = fs.readFileSync('./data/2e3f071a-af2b-4dc9-be5a-7ce72590a181.json', 'utf8');
  var Node2 = JSON.parse(N2);
  var N2speed = fs.readFileSync('./data/2e3f071a-af2b-4dc9-be5a-7ce72590a181-speedtest.json', 'utf8');
  var Node2speed = JSON.parse(N2speed);
 
  //Data for node 3
  var N3 = fs.readFileSync('./data/bed240f5-7c87-4013-90ee-a5bbc21f60da.json', 'utf8');
  var Node3 = JSON.parse(N3);
  var N3speed = fs.readFileSync('./data/bed240f5-7c87-4013-90ee-a5bbc21f60da-speedtest.json', 'utf8');
  var Node3speed = JSON.parse(N3speed);

  //Data for node 4 (Private)
  var N4 = fs.readFileSync('./data/Server-01.json', 'utf8');
  var Node4 = JSON.parse(N4);
  var N4speed = fs.readFileSync('./data/Server-01-speedtest.json', 'utf8');
  var Node4speed = JSON.parse(N4speed);

  res.render('index',  { layout: false,
    Node1Data: Node1,
    Node2Data: Node2,
    Node3Data: Node3,
    Node4Data: Node4,
    Node1DataSpeed: Node1speed,
    Node2DataSpeed: Node2speed,
    Node3DataSpeed: Node3speed,
    Node4DataSpeed: Node4speed
});
});

app.get("/Node1", (req, res) => {

  //Data for node 1
  var N1 = fs.readFileSync('./data/0286b2ad-dc80-4b5c-a0de-b81945b010e8.json', 'utf8');
  var Node1 = JSON.parse(N1);
  var N1speed = fs.readFileSync('./data/0286b2ad-dc80-4b5c-a0de-b81945b010e8-speedtest.json', 'utf8');
  var Node1speed = JSON.parse(N1speed);

  res.render('node1',  { layout: false,
    Node1Data: Node1,
    Node1DataSpeed: Node1speed
});
});

app.get("/Node2", (req, res) => {

  //Data for node 2
  var N2 = fs.readFileSync('./data/2e3f071a-af2b-4dc9-be5a-7ce72590a181.json', 'utf8');
  var Node2 = JSON.parse(N2);
  var N2speed = fs.readFileSync('./data/2e3f071a-af2b-4dc9-be5a-7ce72590a181-speedtest.json', 'utf8');
  var Node2speed = JSON.parse(N2speed);

  res.render('node2',  { layout: false,
    Node2Data: Node2,
    Node2DataSpeed: Node2speed
});
});

app.get("/Node3", (req, res) => {

  //Data for node 3
  var N3 = fs.readFileSync('./data/bed240f5-7c87-4013-90ee-a5bbc21f60da.json', 'utf8');
  var Node3 = JSON.parse(N3);
  var N3speed = fs.readFileSync('./data/bed240f5-7c87-4013-90ee-a5bbc21f60da-speedtest.json', 'utf8');
  var Node3speed = JSON.parse(N3speed);

  res.render('node3',  { layout: false,
    Node3Data: Node3,
    Node3DataSpeed: Node3speed
});
});

app.get("/Node4", (req, res) => {

  //Data for node 4
  var N4 = fs.readFileSync('./data/Server-01.json', 'utf8');
  var Node4 = JSON.parse(N4);
  var N4speed = fs.readFileSync('./data/Server-01-speedtest.json', 'utf8');
  var Node4speed = JSON.parse(N4speed);

  res.render('node4',  { layout: false,
    Node4Data: Node4,
    Node4DataSpeed: Node4speed
});
});


//Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});