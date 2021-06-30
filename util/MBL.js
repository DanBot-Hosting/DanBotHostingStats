const db = require('quick.db');
const ids = db.get('bot.IDs');
const fetch = require('node-fetch');

ids.map(async ID => {
    const res = await fetch(`https://bots.idledev.org/api/dan/bot/${ID}/info`);

    const response = await res.json();

    if (response.error) return; // bot not in mbl

    const info = db.get(ID);
    if (!info) return; // bot not found

    const mbl = {
        invite: response.invite
    };

    console.log(response.invite);
    let up = 'N/A';

    if (response.uptime) {
        up = response.uptime.status;
    }

    const botData = {
        id: info.id,
        keyLastUsed: info.keyLastUsed,
        servers: info.servers,
        users: info.users,
        owner: info.owner,
        client: info.client,
        deleted: info.deleted,
        added: info.added,
        status: up,
        mbl,
        lastPost: info.lastPost
    };

    db.set(ID, botData);
});