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
var bodyParser = require('body-parser');
var fs = require("fs");
var hbs = require('express-handlebars');

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

//View engine setup
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultView: 'default',
  layoutsDir: '/views/pages',
  partialsDir: '/views/partials'
}));


//Routes
app.get("/", (req, res) => {
  var test = require("./data/DESKTOP-4GLHDVM.json");
  res.render('index',  { layout: false,
    info: test
});
});

//Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});