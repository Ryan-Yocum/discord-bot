module.exports.run = async (dc, message, args) => {
  const ytdl = require('ytdl-core');
  if (args[0] == undefined) {
    message.channel.send('Please specify something to watch');
    return;
  };

  const chan = await dc.channels.cache.get('732337886581751868');
  if (args[0] == 'stop') {
    chan.leave();
    return;
  };

  if (!args[0].startsWith('http')) {
    message.channel.send('Please specify a URL');
    return;
  }

  const conn = await chan.join();
  const disp = conn.play(ytdl(args[0], { quality: 'lowestaudio' }));
  disp.setVolume(args[1] || 1);
};