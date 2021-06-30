const unirest = require('unirest');
const fetch = require('node-fetch');
// const btoa = require('btoa');
const { CLIENT_ID, CLIENT_SECRET, DOMAIN } = process.env;

module.exports.getUser = token => new Promise(async (resolve, reject) => {
  /*  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const response = await fetch(
      `https://discordapp.com/api/oauth2/token?grant_type=refresh_token&refresh_token=${token}&scope=identify&redirect_uri=${encodeURIComponent(
        DOMAIN
      )}/api/callback`,
        {
          method: 'POST',
            headers: {
              Authorization: `Basic ${creds}`
            }
          }
        );
        const json = await response.json();
        const data = [];
        unirest
          .get('https://discordapp.com/api/users/@me')
          .headers({ Authorization: `Bearer ${json.access_token}` })
          .end(user => {
            if (user.raw_body.error) return resolve(false);
            data.push(JSON.parse(user.raw_body));
            data.push(json.refresh_token);
            resolve(data);
          }); */
     });

module.exports.getBot = id => new Promise((resolve, reject) => {
  const data = [];
    unirest
      .get(`https://discordapp.com/api/users/${id}`)
      .headers({ Authorization: `Bot ${config.DiscordBot.Token}` })
      .end(user => {
        if (user.raw_body.error) return resolve(false);
        data.push(JSON.parse(user.raw_body));
        resolve(data);
      });
    });
