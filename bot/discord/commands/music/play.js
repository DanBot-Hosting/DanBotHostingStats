exports.run = async (message, args) => {
  const searchString = message.content.slice(1).join(" ");
  const url = args[1] ? args[2].replace(/<(.+)>/g, "$1") : "";
  const serverQueue = queue.get(message.guild.id);

  const voiceChannel = message.member.voiceChannel;
  if (!voiceChannel)
    return message.channel.send({
      embed: {
        description: "I'm sorry but you need to be in a voice channel!",
      },
    });
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT")) {
    return message.channel.send({
      embed: { description: "I cannot connect to your voice channel" },
    });
  }
  if (!permissions.has("SPEAK")) {
    return message.channel.send({
      embed: { description: "I cannot speak in this voice channel" },
    });
  }
  if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
    const playlist = await youtube.getPlaylist(url);
    const videos = await playlist.getVideos();
    for (const video of Object.values(videos)) {
      const video2 = await youtube.getVideoByID(video.id);
      await handleVideo(video2, message, voiceChannel, true);
    }
    return message.channel.send({
      embed: {
        description: `✅ Playlist: **${playlist.title}** has been added to queue!`,
      },
    });
  } else {
    try {
      var video = await youtube.getVideo(url);
    } catch (error) {
      try {
        var videos = await youtube.searchVideos(searchString, 10);
        let index = 0;

        var selectembed = new MessageEmbed()
          .setColor("RANDOM")
          .setTitle("Song selection")
          .setDescription(
            `${videos
              .map((video2) => `**${++index} -** ${video2.title}`)
              .join("\n")}`
          )
          .setFooter(
            "Please provide a value to select one of the search results ranging from 1-10"
          );

        let messagetoDelete = await message.channel.send({
          embed: selectembed,
        });

        try {
          var response = await message.channel.awaitMessages(
            (message2) => message2.content > 0 && message2.content < 11,
            {
              maxMatches: 1,
              time: 30000,
              errors: ["time"],
            }
          );
          messagetoDelete.delete();
        } catch (err) {
          console.error(err);
          const noPick = new RichEmbed()
            .setDescription(
              "No or invalid value entered, cancelling video selection."
            )
            .setColor("RANDOM");
          message.channel.send({ embed: noPick });
          messagetoDelete.delete();
          return;
        }
        const videoIndex = parseInt(response.first().content);
        var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
      } catch (err) {
        console.error(err);
        return message.channel.send(
          "🆘 I could not obtain any search results."
        );
      }
    }
    return handleVideo(video, message, voiceChannel);
  }
};
