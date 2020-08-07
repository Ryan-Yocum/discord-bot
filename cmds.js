// This file handes all the commands
module.exports = {
	cmds: function(dc, embed, msg, message, config) {
		switch (msg) {
		case 'ping':
			message.channel.send('pong');
			break;

		case 'hello':
			message.channel.send('bye', {
				reply: message.author,
			});
			break;

		case 'embed':
			embed.setAuthor(message.author.tag, message.author.defaultAvatarURL);
			embed.setTitle('Embedded');
			message.channel.send(embed);
			break;

		case 'pi':
			message.channel.send('3.141592653589', {
				reply: dc.users.cache.find('L'),
			});
			break;

		case 'gpg':
			message.channel.send('Signed');
			break;

		default:
			break;
		}
	},
};