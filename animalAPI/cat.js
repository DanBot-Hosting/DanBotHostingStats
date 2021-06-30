const fs = require('fs');
const Router = require('express').Router();

Router.get('/', (req, res) => {
    var files = fs.readdirSync('./animalAPI/cat');
    const imagenumber = files[Math.floor(Math.random() * files.length)];
    const data = {
        image: `https://api.danbot.host/cat/${imagenumber}`,
        total: files.length
    };

    res.json(data);
});

Router.get('*', (req, res) => {
    if (fs.existsSync(`./animalAPI/cat/${req.path}`)) {
        var img = fs.readFileSync(`./animalAPI/cat/${req.path}`);
        res.writeHead(200, { 'Content-Type': 'image/gif' });
        res.end(img, 'binary');
    } else {
        res.send('404');
    }
});

module.exports = Router;