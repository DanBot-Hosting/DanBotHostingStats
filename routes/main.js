const Router = require('express').Router();
const DiscordOauth2 = require('discord-oauth2');
const axios = require('axios');
const oauth = new DiscordOauth2({
    clientId: config.DiscordBot.clientID,
    clientSecret: config.DiscordBot.clientSecret
});

Router.get('/', (req, res) => {
    res.json({ error: false, msg: 'DanBot Hosting beta API and Animal API' });
});

Router.get('/stats', (req, res) => {
    try {
        const data = {
            Node1: nodeData.fetch('Node1'),
            Node2: nodeData.fetch('Node2'),
            Node3: nodeData.fetch('Node3'),
            Node4: nodeData.fetch('Node4'),
            Node5: nodeData.fetch('Node5'),
            Node6: nodeData.fetch('Node6'),
            Node7: nodeData.fetch('Node7'),
            Node8: nodeData.fetch('Node8'),
            Node9: nodeData.fetch('Node9'),
            Node10: nodeData.fetch('Node10'),
            Node11: nodeData.fetch('Node11'),
            Node12: nodeData.fetch('Node12'),
            Node13: nodeData.fetch('Node13'),
            Node14: nodeData.fetch('Node14'),

            Node1Status: nodeStatus.fetch('Node1'),
            Node2Status: nodeStatus.fetch('Node2'),
            Node3Status: nodeStatus.fetch('Node3'),
            Node4Status: nodeStatus.fetch('Node4'),
            Node5Status: nodeStatus.fetch('Node5'),
            Node6Status: nodeStatus.fetch('Node6'),
            Node7Status: nodeStatus.fetch('Node7'),
            Node8Status: nodeStatus.fetch('Node8'),
            Node9Status: nodeStatus.fetch('Node9'),
            Node10Status: nodeStatus.fetch('Node10'),
            Node11Status: nodeStatus.fetch('Node11'),
            Node12Status: nodeStatus.fetch('Node12'),
            Node13Status: nodeStatus.fetch('Node13'),
            Node14Status: nodeStatus.fetch('Node14')

        };

        const status = {
            Node1: nodeStatus.fetch('node1'),
            Node2: nodeStatus.fetch('node2'),
            Node3: nodeStatus.fetch('node3'),
            Node4: nodeStatus.fetch('node4'),
            Node5: nodeStatus.fetch('node5'),
            Node6: nodeStatus.fetch('node6'),
            Node7: nodeStatus.fetch('node7'),
            Node8: nodeStatus.fetch('node8'),
            Node9: nodeStatus.fetch('node9'),
            Node10: nodeStatus.fetch('node10'),
            Node11: nodeStatus.fetch('node11'),
            Node12: nodeStatus.fetch('node12'),
            Node13: nodeStatus.fetch('node13'),
            Node14: nodeStatus.fetch('node14')
        };

        res.json({ error: false, data, status });
    } catch (e) {
        res.json({ error: true, message: e });
    }
});

Router.post(
    '/callback',

    async (req, res) => {
        try {
            const { code } = req.query;
            if (!code) return res.json({ error: true, message: 'no code' });

            const { redirect } = req.query;
            if (!redirect) return res.json({ error: true, message: 'no redirect' });

            const info = await oauth.tokenRequest({
                clientId: config.DiscordBot.clientID,
                clientSecret: config.DiscordBot.clientSecret,
                redirectUri: `${redirect}/callback`,

                code,
                scope: 'identify',
                grantType: 'authorization_code'
            });

            const data = {
                user: null
            };

            await oauth.getUser(info.access_token).then(async userInfo => {
                data.user = userInfo;

                res.send(data);
            });
        } catch (e) {
            console.log(e);
            return res.json({ error: true, message: e });
        }
    }
);

Router.get(
    '/callback',

    async (req, res) => {
        try {
            const { code } = req.query;
            if (!code) return res.json({ error: true, message: 'no code' });

            const { redirect } = req.query;
            if (!redirect) return res.json({ error: true, message: 'no redirect' });

            const info = await oauth.tokenRequest({
                clientId: config.DiscordBot.clientID,
                clientSecret: config.DiscordBot.clientSecret,
                redirectUri: `${redirect}/callback`,

                code,
                scope: 'identify',
                grantType: 'authorization_code'
            });

            const data = {
                user: null
            };

            await oauth.getUser(info.access_token).then(async userInfo => {
                data.user = userInfo;
                res.send(data);
            });
        } catch (e) {
            console.log(e);
            return res.json({ error: true, message: e });
        }
    }
);


Router.get('/user/:ID', async (req, res) => {
    try {
        const { ID } = req.params;
        if (!ID) return res.json({ error: true, message: 'no user id' });

        if (!req.headers.authorization || req.headers.authorization !== config.externalPassword) {
            return res.status(401).send({
                error: true,
                status: 401,
                message: !req.headers.authorization ? 'no authorization header' : 'unauthorized'
            });
        }

        const userData = userData.get(ID);

        if (userData == null) {
            return res.json({
                error: true,
                status: 404,
                message: 'User not found'
            });
        } else {
            const data = {
                username: userData.username,
                email: userData.email,
                discordID: userData.discordID,
                consoleID: userData.consoleID,
                linkTime: userData.linkTime,
                linkDate: userData.linkDate
            };

            res.json({
                error: false,
                data,
                message: 'OK'
            });
        }
    } catch (e) {
        console.log(e);
        res.json({
            error: true,
            message: e
        });
    }
});

Router.post('/user/:ID/new', async (req, res) => {
    try {
        const { ID } = req.params;
        if (!ID) return res.json({ error: true, message: 'no user id' });

        // console.log(req.headers)
        // console.log(req.body)

        if (!req.headers.authorization || req.headers.authorization !== config.externalPassword) {
            return res.status(401).send({
                error: true,
                status: 401,
                message: !req.headers.authorization ? 'no authorization header' : 'unauthorized'
            });
        }

        if (!req.body || !req.body.email || !req.body.username || !req.body.password || !req.body.id) {
            if (!req.body) {
                return res.status(404).send({
                    error: true,
                    status: 404,
                    message: 'no body'
                });
            }

            const toSend = {
                error: true,
                status: 404,
                message: 'Missing body variables: '
            };

            const missing = [];

            if (!req.body.id) missing.push('id');
            if (!req.body.email) missing.push('email');
            if (!req.body.username) missing.push('username');
            if (!req.body.password) missing.push('password');

            toSend.message += missing.join(', ');

            return res.status(404).send(toSend);
        }


        const data = {
            username: req.body.username,
            email: req.body.email,
            first_name: req.body.username,
            last_name: '.',
            password: req.body.password,
            root_admin: false,
            language: 'en'
        };

        axios({
            url: `${config.Pterodactyl.hosturl}/api/application/users`,
            method: 'POST',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                Authorization: `Bearer ${config.Pterodactyl.apikey}`,
                'Content-Type': 'application/json',
                Accept: 'Application/vnd.pterodactyl.v1+json'
            },
            data
        }).then(user => {
            userData.set(`${req.body.id}`, {
                discordID: req.body.id,
                consoleID: user.data.attributes.id,
                email: user.data.attributes.email,
                username: user.data.attributes.username,
                linkTime: moment().format('HH:mm:ss'),
                linkDate: moment().format('YYYY-MM-DD'),
                domains: []
            });

            res.json({
                error: false,
                user,
                message: 'OK'
            });
        }).catch(err => {
            console.log(err);
            res.json({
                error: true,
                message: err
            });
        });
    } catch (e) {
        console.log(e);
        res.json({
            error: true,
            message: e
        });
    }
});

Router.get('/user/:ID/servers', (req, res) => {
    if (!req.headers.authorization || req.headers.authorization !== config.externalPassword) {
        return res.status(401).send({
            error: true,
            status: 401,
            message: !req.headers.authorization ? 'no authorization header' : 'unauthorized'
        });
    }

    var arr = [];
    try {
        const { ID } = req.params;
        if (!ID) return res.json({ error: true, message: 'no user id' });
        axios({
            url: `${'https://panel.danbot.host' + '/api/application/users/'}${userData.get(ID).consoleID}?include=servers`,
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                Authorization: `Bearer ${config.Pterodactyl.apikey}`,
                'Content-Type': 'application/json',
                Accept: 'Application/vnd.pterodactyl.v1+json'
            }
        }).then(response => {
            const preoutput = response.data.attributes.relationships.servers.data;
            arr.push(...preoutput);
            setTimeout(async () => {
                // console.log(arr)
                setTimeout(() => {
                    var clean = arr.map(e => e.attributes.container);
                    // console.log(clean)

                    res.json({
                        error: false,
                        data: arr,
                        message: 'OK'
                    });
                }, 500);
            }, 5000);
        });
    } catch (e) {
        console.log(e);
        res.json({
            error: true,
            message: e
        });
    }
});

Router.get('/user/:ID/password-reset-code', async (req, res) => {
    try {
        const { ID } = req.params;
        if (!ID) return res.json({ error: true, message: 'no user id' });

        // console.log(req.headers)
        // console.log(req.body)

        if (!req.headers.authorization || req.headers.authorization !== config.externalPassword) {
            return res.status(401).send({
                error: true,
                status: 401,
                message: !req.headers.authorization ? 'no authorization header' : 'unauthorized'
            });
        }

        function codegen(length) {
            let result = '';
            const characters = '23456789';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }

        const code = codegen(10);

        axios({
            url: `${config.Pterodactyl.hosturl}/api/application/users/${userData.get(ID).consoleID}`,
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                Authorization: `Bearer ${config.Pterodactyl.apikey}`,
                'Content-Type': 'application/json',
                Accept: 'Application/vnd.pterodactyl.v1+json'
            }
        }).then(fetch => {
            const emailmessage = {
                from: config.Email.From,
                to: fetch.data.attributes.email,
                subject: 'DanBot Hosting - Password reset via website',
                html: `Hello, someone has requested for a password reset here is the code:  ${code}`
            };
            transport.sendMail(emailmessage);

            return res.json({ error: false, message: 'SENT', data: { code } });
        });
    } catch (e) {
        console.log(e);
        res.json({
            error: true,
            message: e
        });
    }
});

Router.get('*', async (req, res) => {
    res.status(404).send({
        error: true,
        status: 404,
        message: 'Endpoint not found'
    });
});

module.exports = Router;
