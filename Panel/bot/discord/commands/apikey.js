let db = require("quick.db");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  /* to do: 
   
    - create api key, example: danbot-key
    - send it to the user
    - reset a key
    - store the key under an array
   
   */

  let startkey = Math.random()
    .toString(36)
    .substring(7);
  let key = `danbot-${startkey}`;

  let keyPool = db.get("apiKeys");
  if (!keyPool) keyPool = [];

  if (!args[0]) {
    if (db.has(`${message.author.id}_apikey`)) {
      return message.channel.send(
        "You already have a `Key`, please check your direct messages, \n or do `DBH!APIKey Reset`"
      );
    }

    let Awaiter = await message.channel.send(
      "Getting you an `API` Key please wait..."
    );

    setTimeout(() => {
      command();
      Awaiter.delete();
    }, 2500);

    async function command() {
      try {
        let apiKeyEmbed = new Discord.RichEmbed()
          .setColor("BLUE")
          .setTitle("DanBot Hosting Bot Stats")
          .setDescription(
            `API Key:\n\`${key}\`\n\nHow to Post? [Visit This](https://www.npmjs.com/package/danbot-hosting) \n Package Github: [Click Here](https://github.com/danbot-devs/danbot-hosting)`
          );

        message.author.send(apiKeyEmbed);
        message.channel.send("Check your direct messages for your `API` key.");
      } catch (e) {
        return message.channel.send(
          `I ran into an error while trying to setup your api key. \n Error: ${e}`
        );
      }

      db.push("apiKeys", key);
      db.set(`${message.author.id}_apikey`, key);
      db.set(`${key}`, message.author.id)
      return;
    }
  }

  if (args[0].toLowerCase() === "reset") {
    // reset token
    let token = db.get(`${message.author.id}_apikey`);
    if (!token)
      return message.channel.send(
        "You dont have an api key to reset, please use `DBH!APIKey` to generate one!"
      );

    let Reset = await message.channel.send(`Resetting your API Key...`);

    setTimeout(() => {
      rest();
      Reset.delete();
    }, 2500);

    async function rest() {
      let keys = db.get("apiKeys");
      var filtered = keys.filter(function (el) {
        return el != `${token}`;
      });

      db.set("apiKeys", filtered);
      db.delete(`${message.author.id}_apikey`);
      db.delete(`${token}`)
      return message.channel.send("Your API Key has been reset!");
    }
  }
};