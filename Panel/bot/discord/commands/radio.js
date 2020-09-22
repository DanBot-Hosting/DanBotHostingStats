exports.run = (client, message) => {
    message.channel.send('Playing...')
    client.channels.get("691609366155100201").join()
                      .then(connection => {
                          connection.playStream('http://207.180.236.5:8000/DanBotFM')
                      });

    };