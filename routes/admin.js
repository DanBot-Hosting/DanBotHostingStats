const Router = require('express').Router();
const db = require('quick.db');
const isSnowflake = require(`${process.cwd()}/util/isSnowflake.js`);

Router.get('/', checkAuth, (req, res) => {
    const bots = db.get(`${req.user.id}.bots`);
    res.render('admin.ejs', {
        user: req.isAuthenticated() ? req.user : null, bots, db
    });
});

Router.post('/', checkAuth, (req, res) => {
    const data = req.body;
    console.log(data);
});

// Settings page
Router.get('/settings', checkAuth, (req, res) => {
    const bots = db.get(`${req.user.id}.bots`);
    res.render('admin-settings.ejs', {
        user: req.isAuthenticated() ? req.user : null, bots, db
    });
});

Router.post('/settings', checkAuth, (req, res) => {
    const data = req.body;
    console.log(data);
});

Router.post('/node1', checkAuth, (req, res) => {
    const data = req.body;
    console.log(data);
});

Router.get('/node1', checkAuth, (req, res) => {
    const bots = db.get(`${req.user.id}.bots`);
    const items = nodeData.fetch('Node1-docker.dockerAll');
    const filteredItems = items.filter(i => i.state === 'running');

    res.render('node1-admin.ejs', {
        table: filteredItems,
        user: req.isAuthenticated() ? req.user : null, bots, db
    });
});

Router.post('/node2', checkAuth, (req, res) => {
    const data = req.body;
    console.log(data);
});

Router.get('/node2', checkAuth, (req, res) => {
    const bots = db.get(`${req.user.id}.bots`);
    const items = nodeData.fetch('Node2-docker.dockerAll');
    const filteredItems = items.filter(i => i.state === 'running');

    res.render('node2-admin.ejs', {
        table: filteredItems,
        user: req.isAuthenticated() ? req.user : null, bots, db
    });
});

Router.post('/node5', checkAuth, (req, res) => {
    const data = req.body;
    console.log(data);
});

Router.get('/node5', checkAuth, (req, res) => {
    const bots = db.get(`${req.user.id}.bots`);
    const items = nodeData.fetch('Node5-docker.dockerAll');
    const filteredItems = items.filter(i => i.state === 'running');

    res.render('node5-admin.ejs', {
        table: filteredItems,
        user: req.isAuthenticated() ? req.user : null, bots, db
    });
});

Router.post('/node7', checkAuth, (req, res) => {
    const data = req.body;
    console.log(data);
});

Router.get('/node7', checkAuth, (req, res) => {
    const bots = db.get(`${req.user.id}.bots`);
    const items = nodeData.fetch('Node7-docker.dockerAll');
    const filteredItems = items.filter(i => i.state === 'running');

    res.render('node7-admin.ejs', {
        table: filteredItems,
        user: req.isAuthenticated() ? req.user : null, bots, db
    });
});

// Requests/tickets page
Router.get('/requests', checkAuth, (req, res) => {
    const bots = db.get(`${req.user.id}.bots`);
    res.render('requests-admin.ejs', {
        user: req.isAuthenticated() ? req.user : null, bots, db
    });
});

Router.post('/requests', checkAuth, (req, res) => {
    const data = req.body;
    console.log(data);
});

module.exports = Router;

/*
 * Authorization check, if not authorized return them to the login page.
 */
function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        const allowed = ['293841631583535106', '137624084572798976']; // Solo, Dan
        allowed.push(bot.owner);

        if (allowed.includes(req.user.id)) {
            return next();
        } else {
            res.redirect('/me');
        }
    } else {
        req.session.backURL = req.url;
        res.redirect('/login?redirect=/me');
    }
}
