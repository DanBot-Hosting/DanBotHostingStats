const fs = require('fs');
module.exports = (client, utils, ytdl, message) => {
      const prefix = config.DiscordBot.Prefix;

    client.handleVideo = async (video, message, vc, playlist = false) => {
        let queue = client.queue.get(message.guild.id);
        let music = {
            id: video.id,
            title: video.title,
            url: `https://www.youtube.com/watch?v=${video.id}`
        };

        if (!queue) {
            let queueConstruct = {
                textChannel: message.channel,
                voiceChannel: vc,
                connection: null,
                musics: [],
                volume: 100,
                playing: true
            };
            let voteConstruct = {
                votes: 0,
                voters: []
            };

            client.queue.set(message.guild.id, queueConstruct);
            client.votes.set(message.guild.id, voteConstruct)
            queueConstruct.musics.push(music);

            try {
                var connection = await vc.join();
                queueConstruct.connection = connection;
                client.play(message.guild, queueConstruct.musics[0]);
            } catch (err) {
                client.queue.delete(message.guild.id);
                console.error(`I could not join your voice channel: ${err}`);
            }
        } else {
            queue.musics.push(music);
            if (playlist) return;
            else return message.channel.send(`**${music.title}** has been added to queue`);
        }
        return;
    }

    client.play = (guild, music) => {
        let queue = client.queue.get(guild.id);
        let votes = client.votes.get(guild.id)
        if (!music) {
            queue.voiceChannel.leave();
            client.queue.delete(guild.id);
            client.votes.delete(guild.id);
            return queue.textChannel.send(`Music playback has ended`);
        }

        let dispatcher = queue.connection.playStream(ytdl(music.url))
            .on('end', () => {
                queue.musics.shift();
                votes.votes = 0;
                votes.voters = [];
                setTimeout(() => {
                    client.play(guild, queue.musics[0]);
                }, 250);
            })
            .on('error', err => console.error(err));
        dispatcher.setVolumeLogarithmic(queue.volume / 100);

        queue.textChannel.send(`**${music.title}** is now being played`);
    }
}