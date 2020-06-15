module.exports = async (client, guild, files) => {
    console.log(chalk.magenta('[DISCORD] ') + chalk.green("Bot logged in!"));

//Auto Activities List
const activities = [
    {
        "text": "over DanBot Hosting",
        "type": "WATCHING"
    },
    {
        "text": "DanBot FM",
        "type": "LISTENING"
    }
];
setInterval(() => {
    const activity = activities[Math.floor(Math.random() * activities.length)];
    client.user.setActivity(activity.text, { type: activity.type }); 
}, 30000); 

global.invites = {};
client.guilds.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      invites[g.id] = guildInvites;
    });
  });
};