/* _____                                __  __                _  _               
  / ____|                              |  \/  |              (_)| |              
 | (___    ___  _ __ __   __ ___  _ __ | \  / |  ___   _ __   _ | |_  ___   _ __ 
  \___ \  / _ \| '__|\ \ / // _ \| '__|| |\/| | / _ \ | '_ \ | || __|/ _ \ | '__|
  ____) ||  __/| |    \ V /|  __/| |   | |  | || (_) || | | || || |_| (_) || |   
 |_____/  \___||_|     \_/  \___||_|   |_|  |_| \___/ |_| |_||_| \__|\___/ |_|  
 Free Monitoring software made by danielpmc                                                      
*/

var config = require("./config.json");
var PORT = config.ListeningPort;
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var fs = require("fs");
var hbs = require('express-handlebars');
var chalk = require('chalk');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

server.listen(PORT, function () {
    console.log(chalk.green("Listening on port " + PORT));
});


app.get('/data', function (req, res) {
    console.log(req.query);

    //Write data to JSON file after checking servername.
    var data = JSON.stringify(req.query);
    fs.writeFileSync('data/' + req.query.servername + '.json', data);

});

//View engine setup
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultView: 'default',
  layoutsDir: '/views/pages',
  partialsDir: '/views/partials'
}));

//Config Loading and setting up
if (config.Servers.NumberOfServers == 0) {

  //Errors if config is not setup.
  console.log(chalk.red("You have not set up the config file"))
  process.exit()

} else if (config.Servers.NumberOfServers == 1) {
  if (config.Servers.One == " ") {

    //Checks if server one field in config has valid data.
    console.log(chalk.red("You have not set up Server names. Please fill in `One` in the config with your hostname. Don't know it? Run the daemon and that will tell you the hostname!"));
    process.exit();

  } else {

    //Config has valid data for server one. Set up the website!
    //Loads the data
    var ServerOneData = fs.readFileSync("./data/" + config.Servers.One + ".json", 'utf8');
    var ServerOne = JSON.parse(ServerOneData);

    //Gets the website page and is ready to display it.
    app.get("/" + config.Servers.One, (req, res) => {
      res.render('ServerOne',  { layout: false,
        Data: ServerOne
    });
    });

  }
} else if (config.Servers.NumberOfServers == 2) {
  if (config.Servers.One == " ") {

    //Checks if server one field in config has valid data.
    console.log(chalk.red("You have not set up Server names. Please fill in `One` in the config with your hostname. Don't know it? Run the daemon and that will tell you the hostname!"));
    process.exit();

  } else if (config.Servers.Two == " ") {

    //Checks if server two field in config has valid data.
    console.log(chalk.red("You have not set up Server names. Please fill in `Two` in the config with your hostname. Don't know it? Run the daemon and that will tell you the hostname!"));
    process.exit();

  } else {

    //Config has valid data for server one. Set up the website!

    //Loads the data (SERVER ONE)
    var ServerOneData = fs.readFileSync("./data/" + config.Servers.One + ".json", 'utf8');
    var ServerOne = JSON.parse(ServerOneData);

    //Gets the website page and is ready to display it. (Server ONE)
    app.get("/" + config.Servers.One, (req, res) => {
      
      //Loads the data (SERVER ONE)
      var ServerOneData = fs.readFileSync("./data/" + config.Servers.One + ".json", 'utf8');
      var ServerOne = JSON.parse(ServerOneData);

      res.render('ServerOne',  { layout: false,
        Data: ServerOne
    });
   });

    //Loads the data (SERVER TWO)
    var ServerTwoData = fs.readFileSync("./data/" + config.Servers.Two + ".json", 'utf8');
    var ServerTwo = JSON.parse(ServerTwoData);

    //Gets the website page and is ready to display it. (Server ONE)
    app.get("/" + config.Servers.Two, (req, res) => {
      res.render('ServerTwo',  { layout: false,
        Data: ServerTwo
    });
    });

    }
} else if (config.Servers.NumberOfServers == 3) {
  if (config.Servers.One == " ") {

    //Checks if server one field in config has valid data.
    console.log(chalk.red("You have not set up Server names. Please fill in `One` in the config with your hostname. Don't know it? Run the daemon and that will tell you the hostname!"));
    process.exit();

  } else if (config.Servers.Two == " ") {

    //Checks if server two field in config has valid data.
    console.log(chalk.red("You have not set up Server names. Please fill in `Two` in the config with your hostname. Don't know it? Run the daemon and that will tell you the hostname!"));
    process.exit();

  } else if (config.Servers.Three == " ") {

    //Checks if server two field in config has valid data.
    console.log(chalk.red("You have not set up Server names. Please fill in `Three` in the config with your hostname. Don't know it? Run the daemon and that will tell you the hostname!"));
    process.exit();

  } else {

    //Config has valid data for server one. Set up the website!

    //Loads the data (SERVER ONE)
    var ServerOneData = fs.readFileSync("./data/" + config.Servers.One + ".json", 'utf8');
    var ServerOne = JSON.parse(ServerOneData);

    //Gets the website page and is ready to display it. (Server ONE)
    app.get("/" + config.Servers.One, (req, res) => {
      res.render('ServerOne',  { layout: false,
        Data: ServerOne
    });
   });

    //Loads the data (SERVER TWO)
    var ServerTwoData = fs.readFileSync("./data/" + config.Servers.Two + ".json", 'utf8');
    var ServerTwo = JSON.parse(ServerTwoData);

    //Gets the website page and is ready to display it. (Server TWO)
    app.get("/" + config.Servers.Two, (req, res) => {
      res.render('ServerTwo',  { layout: false,
        Data: ServerTwo
    });
    });

    //Loads the data (SERVER THREE)
    var ServerThreeData = fs.readFileSync("./data/" + config.Servers.Three + ".json", 'utf8');
    var ServerThree = JSON.parse(ServerThreeData);

    //Gets the website page and is ready to display it. (Server THREE)
    app.get("/" + config.Servers.Three, (req, res) => {
      res.render('ServerThree',  { layout: false,
        Data: ServerThree
    });
    });

    }
}

//Import data
var data = fs.readFileSync('./data/DESKTOP-4GLHDVM.json', 'utf8');
var data1 = JSON.parse(data);

//Routes
app.get("/", (req, res) => {
  res.render('index',  { layout: false,
    info: data1
});
});

//Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});