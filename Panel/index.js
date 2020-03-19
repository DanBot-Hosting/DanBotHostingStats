/* _____                                __  __                _  _               
  / ____|                              |  \/  |              (_)| |              
 | (___    ___  _ __ __   __ ___  _ __ | \  / |  ___   _ __   _ | |_  ___   _ __ 
  \___ \  / _ \| '__|\ \ / // _ \| '__|| |\/| | / _ \ | '_ \ | || __|/ _ \ | '__|
  ____) ||  __/| |    \ V /|  __/| |   | |  | || (_) || | | || || |_| (_) || |   
 |_____/  \___||_|     \_/  \___||_|   |_|  |_| \___/ |_| |_||_| \__|\___/ |_|  
 Free Monitoring software made by danielpmc                                                      
*/

//var config = require("./config.json");
var PORT = "1144";
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var fs = require("fs");
var chalk = require('chalk');
const hbs = require('hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

server.listen(PORT, function () {
    console.log(chalk.green("Listening on port " + PORT));
});


app.get('/data', function (req, res) {
    //console.log(req.query);

    //Write data to JSON file after checking servername.
    var data = JSON.stringify(req.query);
    fs.writeFileSync('data/' + req.query.servername + '.json', data);

});

//View engine setup
hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

//Routes
app.get("/", (req, res) => {

  //Data for node 1
  var N1 = fs.readFileSync('./data/vmi347338.contaboserver.net.json', 'utf8');
  var Node1 = JSON.parse(N1);

  //Data for node 2
  var N2 = fs.readFileSync('./data/vmi347340.contaboserver.net.json', 'utf8');
  var Node2 = JSON.parse(N2);
 
  //Data for node 3
  var N3 = fs.readFileSync('./data/vmi347402.contaboserver.net.json', 'utf8');
  var Node3 = JSON.parse(N3);

  //Data for node 4
  var N4 = fs.readFileSync('./data/vmi344960.contaboserver.net.json', 'utf8');
  var Node4 = JSON.parse(N4);

  res.render('index',  { layout: false,
    Node1Data: Node1,
    Node2Data: Node2,
    Node3Data: Node3,
    Node4Data: Node4
});
});

//Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});