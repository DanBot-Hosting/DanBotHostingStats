

//Upcoming database server.


//Fetch premium count
global.premium = async function premium(input) {
    const out = await axios.post(config.db + `/userPremGet?ID=${input}`);
    return out.data;
}

global.premiumUsed = async function premiumUsed(used, total, ID) {
    const out = await axios.post(config.db + `/userPremUsed?ID=${ID}&used=${used}`);
    return out.data;
}

global.premiumDonated = async function premiumDonated(used, total, ID) {
    const out = await axios.post(config.db + `/userPremDonated?ID=${ID}&donated=${total}`);
    return out.data;
}

//Fetch database uptime
global.dbUptime = async function dbUptime() {
    const out = await axios.get(config.db + `/uptime`);
    return out.data;
}

