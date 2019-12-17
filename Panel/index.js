/* _____                                __  __                _  _               
  / ____|                              |  \/  |              (_)| |              
 | (___    ___  _ __ __   __ ___  _ __ | \  / |  ___   _ __   _ | |_  ___   _ __ 
  \___ \  / _ \| '__|\ \ / // _ \| '__|| |\/| | / _ \ | '_ \ | || __|/ _ \ | '__|
  ____) ||  __/| |    \ V /|  __/| |   | |  | || (_) || | | || || |_| (_) || |   
 |_____/  \___||_|     \_/  \___||_|   |_|  |_| \___/ |_| |_||_| \__|\___/ |_|  
 Free Monitoring software made by danielpmc                                                      
*/

var PORT = 80;
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var fs = require("fs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

server.listen(PORT, function () {
    console.log(PORT + " listening...");
});


app.get('/data', function (req, res) {
    console.log(req.query);

    //Write data to JSON file after checking servername.
    var data = JSON.stringify(req.query);
    fs.writeFileSync('data/' + req.query.servername + '.json', data);

});

//Main website stuff
var path = require('path');
var helmet = require("helmet");

//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(helmet());

//Set path for static assets
app.use(express.static(path.join(__dirname, 'public')));

//Render template.
const dataDir = path.resolve(`${process.cwd()}${path.sep}website`);
const templateDir = path.resolve(`${dataDir}${path.sep}templates`);
const renderTemplate = (res, req, template, data = {}) => {
  res.render(path.resolve(`${templateDir}${path.sep}${template}`))
};


var test = require("./data/Server-01.json");
//Routes
app.get("/", (req, res) => {
  renderTemplate(res, req, "index.ejs", {
    test: {
      cpuman: test.cpuman
    }
  });
});

//Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});