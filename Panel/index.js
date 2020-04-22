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

//Discord Bot
//require('./bot/discord/index.js')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

server.listen(PORT, function () {
    console.log(chalk.green("Listening on port " + PORT));
});

app.get('/data', function (req, res) {
    //console.log(req.query);

    //Write data to JSON file after checking the servers Hostname.
    var data = JSON.stringify(req.query);
    fs.writeFileSync('data/' + req.query.servername + '.json', data);

});

//Discord bot
var node = require('nodeactyl-beta');
global.DanBotHosting = node.Application;
global.Discord = require("discord.js");
const client = new Discord.Client()
global.fs = require("fs");
global.moment = require("moment");

//Event handler
fs.readdir('./bot/discord/events/', (err, files) => {
  files = files.filter(f => f.endsWith('.js'));
  files.forEach(f => {
      const event = require(`./bot/discord/events/${f}`);
      client.on(f.split('.')[0], event.bind(null, client));
      delete require.cache[require.resolve(`./bot/discord/events/${f}`)];
    });
  }); 

//Command handler
client.on('message', message => {

    const prefix = config.DiscordBot.Prefix;
    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandargs = message.content.split(' ').slice(1).join(' ');
    const command = args.shift().toLowerCase();
    console.log(`[${message.author.username}] [${message.author.id}] >> ${prefix}${command} ${commandargs}`);
        try {
            let commandFile = require(`./bot/discord/commands/${command}.js`);
            commandFile.run(client, message, args);
        } catch (err) {
                if (err instanceof Error && err.code === "MODULE_NOT_FOUND") {
                    return console.log(err)
             }
    }  
})

//Logging into pterodactyl using Nodeactyl
DanBotHosting.login(config.Pterodactyl.hosturl, config.Pterodactyl.apikey, (logged_in) => {
  console.log("Nodeactyl logged in? " + logged_in);
});

//Bot login
client.login(config.DiscordBot.Token);

//View engine setup
hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

//Routes
app.get("/", (req, res) => {

  //Data for node 1
  var N1 = fs.readFileSync('./data/0286b2ad-dc80-4b5c-a0de-b81945b010e8.json', 'utf8');
  var Node1 = JSON.parse(N1);

  //Data for node 2
  var N2 = fs.readFileSync('./data/2e3f071a-af2b-4dc9-be5a-7ce72590a181.json', 'utf8');
  var Node2 = JSON.parse(N2);
 
  //Data for node 3
  var N3 = fs.readFileSync('./data/6fc3e9bf-24a8-47cd-99d3-fa159e05a9f4.json', 'utf8');
  var Node3 = JSON.parse(N3);

  //Data for node 4
  var N4 = fs.readFileSync('./data/15ffcdd0-a021-4ded-977d-284d777330a0.json', 'utf8');
  var Node4 = JSON.parse(N4);

  //Data for node 5 (Private)
  var N5 = fs.readFileSync('./data/Server-01.json', 'utf8');
  var Node5 = JSON.parse(N5);

  res.render('index',  { layout: false,
    Node1Data: Node1,
    Node2Data: Node2,
    Node3Data: Node3,
    Node4Data: Node4,
    Node5Data: Node5
});
});

app.get("/Node1", (req, res) => {

  //Data for node 1
  var N1 = fs.readFileSync('./data/0286b2ad-dc80-4b5c-a0de-b81945b010e8.json', 'utf8');
  var Node1 = JSON.parse(N1);

  res.render('node1',  { layout: false,
    Node1Data: Node1
});
});

app.get("/Node2", (req, res) => {

  //Data for node 2
  var N2 = fs.readFileSync('./data/2e3f071a-af2b-4dc9-be5a-7ce72590a181.json', 'utf8');
  var Node2 = JSON.parse(N2);

  res.render('node2',  { layout: false,
    Node2Data: Node2
});
});

app.get("/Node3", (req, res) => {

  //Data for node 3
  var N3 = fs.readFileSync('./data/6fc3e9bf-24a8-47cd-99d3-fa159e05a9f4.json', 'utf8');
  var Node3 = JSON.parse(N3);

  res.render('node3',  { layout: false,
    Node3Data: Node3
});
});

app.get("/Node4", (req, res) => {

  //Data for node 4
  var N4 = fs.readFileSync('./data/15ffcdd0-a021-4ded-977d-284d777330a0.json', 'utf8');
  var Node4 = JSON.parse(N4);

  res.render('node4',  { layout: false,
    Node4Data: Node4
});
});

app.get("/Node5", (req, res) => {

  //Data for node 5
  var N5 = fs.readFileSync('./data/Server-01.json', 'utf8');
  var Node5 = JSON.parse(N5);

  res.render('node5',  { layout: false,
    Node5Data: Node5
});
});

//Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});