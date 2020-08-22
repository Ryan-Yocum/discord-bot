// Includes of the libraries
const Discord = require('discord.js');
require('dotenv').config();
const sqlite3 = require('sqlite3');
const token = process.env.TOKEN;
const config = require('./config.json');
const cmds = require('./cmds.js');


// Create a Discord Client
const dc = new Discord.Client();

// Events

// Ready Event is when it connects to discord and is ready to receive events
dc.once('ready', () => {
	console.log('Ready!');
	// Send hello to the general channel (The IDS are in config.json)
//	dc.channels.cache.get(config.generalId).send('Hello');
});

// This event is fired every time a message is sent
dc.on('message', message => {

	// Look only in the general channel, and ignore the !rank command (This is done later) and if a message starts with the prefix (in config.json)
	if ((message.channel.id == config.generalId) || (message.channel.id == config.otherChannelId) && (message.content.startsWith(config.prefix))) {

		// Removes the prefix from the string so it is easier to deal with
		const msg = message.content.substr(1);

		// Creates a new Message Embed to work with.
		const embed = new Discord.MessageEmbed();

		// Sends to the function cmds in cmds.js
		cmds.cmds(dc, embed, msg, message, config);
	}


// if a user comes online, the bot will respond 'Hello @user'
/* This may be disabled because it is very annoying This event fires every time a user's status changes */
dc.on('presenceUpdate', (oldPresence, newPresence) => {

	// If the user was previously offline and now online, this runs
	if (newPresence.status == 'online' && oldPresence.status == 'offline') {

		// Finds the user's username and splits it based on # (Discord shows usernames with their 4 digit id such as @someone#1234/ This removes the number)
		const usr = (newPresence.user.tag).split('#');

		// Sets a welcome message. The split command creates an array, so the first element in the array is the username, and the second is the number, which we do not need
		const welmsg = (`Welcome ${usr[0]}`);

		// Sends the welcome message in the general channel
		dc.channels.cache.get(config.generalId).send(welmsg, {

			// Sets the reply attribute so it can mention the user
			'reply': newPresence.user,
		});
	}
});

// This logs the server into discord using the token (Everything is events, so it can run last)
dc.login(token);