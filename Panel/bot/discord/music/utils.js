let disc;
let b;
let conf;
let msg;
let a;
let g;

module.exports = {

    load: (discord, client, config, message, args, guild) => {
        disc = discord;
        b = client;
        conf = config;
        msg = message;
        a = args;
        g = guild;
    },

    timed_msg: (string, time) => {
        return message.channel.send(string).then(msg => msg.delete(time));
    },

    no_perm: (error) => {
        let embed = new Discord.RichEmbed()
            .setColor('#B6C2F5')
            .setAuthor('ERROR: Insufficient Permissions!')
            .setDescription(error)
            .setFooter('Insufficient Permissions!');

        return embed;
    },

    cmd_fail: (error, syntax) => {
        let embed = new Discord.RichEmbed()
            .setColor("#B6C2F5")
            .setAuthor('ERROR: WRONG SYNTAX')
            .setDescription(error)
            .setFooter(syntax);
        return embed;
    }
}