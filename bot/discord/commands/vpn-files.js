exports.run = async (client, message, args) => {
    if(!message.member.roles.cache.find((r) => r.id === "898041755419693126")) {
        return message.reply("Only beta testers can use this command!");
    }

    return message.reply("Information on accessing the DBH VPN can be found here: https://discord.com/channels/639477525927690240/898354771927400538/1138808051055476896");
};
