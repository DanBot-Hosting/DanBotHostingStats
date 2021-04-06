const db = require("quick.db");
let ids = db.get("bot.IDs");
let fetch = require("node-fetch");

ids.map(async ID => {

    let res = await fetch(`https://bots.idledev.org/api/dan/bot/${ID}/info`);

    let response = await res.json();

    if (response.error) return; // bot not in mbl

    let info = db.get(ID);
    if (!info) return; // bot not found

    let mbl = {
        invite: response.invite
    }

    console.log(response.invite)
    let up = "N/A";

    if (response.uptime) {
        up = response.uptime.status
    }

    let botData = {
        id: info.id,
        keyLastUsed: info.keyLastUsed,
        servers: info.servers,
        users: info.users,
        owner: info.owner,
        client: info.client,
        deleted: info.deleted,
        added: info.added,
        status: up,
        mbl: mbl,
        lastPost: info.lastPost
    };

    db.set(ID, botData);

});