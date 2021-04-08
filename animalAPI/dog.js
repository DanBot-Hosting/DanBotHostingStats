const fs = require('fs');
const Router = require("express").Router();

Router.get("/", (req, res) => {

    var files = fs.readdirSync('./animalAPI/dog')
    let imagenumber = files[Math.floor(Math.random() * files.length)]
    let data = {
        image: "https://api.danbot.host/dog/" + imagenumber,
        total: files.length
    };

    res.json(data);
});

Router.get('*', (req, res) => {
    if (fs.existsSync('./animalAPI/dog/' + req.path)) {
        var img = fs.readFileSync('./animalAPI/dog/' + req.path);
        res.writeHead(200, {'Content-Type': 'image/gif'});
        res.end(img, 'binary')
    } else {
        res.send('404')
    }
})

module.exports = Router;