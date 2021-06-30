const Router = require('express').Router();
const db = require('quick.db');
const isSnowflake = require(`${process.cwd()}/util/isSnowflake.js`);

Router.get('/', (req, res) => {
    const n1 = [nodeData.fetch('Node1')];
    const n2 = [nodeData.fetch('Node2')];
    const n3 = [nodeData.fetch('Node3')];
    const n4 = [nodeData.fetch('Node4')];
    const n5 = [nodeData.fetch('Node5')];
    const n6 = [nodeData.fetch('Node6')];
    const n7 = [nodeData.fetch('Node7')];
    const n8 = [nodeData.fetch('Node8')];
    const n9 = [nodeData.fetch('Node9')];
    const n10 = [nodeData.fetch('Node10')];
    const n11 = [nodeData.fetch('Node11')];
    const n12 = [nodeData.fetch('Node12')];
    const n13 = [nodeData.fetch('Node13')];
    const n14 = [nodeData.fetch('Node14')];
    const n15 = [nodeData.fetch('Node15')];
    const n16 = [nodeData.fetch('Node16')];
    const n17 = [nodeData.fetch('Node17')];
    const data = n1.concat(n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12, n13, n14, n15, n16, n17);
    res.render('stats.ejs', {
        table: data,
        user: req.isAuthenticated() ? req.user : null
    });
});

Router.get('/all', (req, res) => {
    res.render('index.ejs', {
        layout: false,
        user: req.isAuthenticated() ? req.user : null
    });
});

Router.get('/Node1', (req, res) => {
    res.render('node1.ejs', {
        layout: false,
        user: req.isAuthenticated() ? req.user : null
    });
});

Router.get('/Node2', (req, res) => {
    res.render('node2.ejs', {
        layout: false,
        user: req.isAuthenticated() ? req.user : null
    });
});

Router.get('/Node3', (req, res) => {
    res.render('node3.ejs', {
        layout: false,
        user: req.isAuthenticated() ? req.user : null
    });
});

Router.get('/Node4', (req, res) => {
    res.render('node4.ejs', {
        layout: false,
        user: req.isAuthenticated() ? req.user : null
    });
});

module.exports = Router;
