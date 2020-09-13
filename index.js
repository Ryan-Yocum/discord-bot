/* eslint-disable prefer-const */

// Includes of the libraries
const fs = require('fs').promises;
const path = require('path');
const Discord = require('discord.js');
require('dotenv').config();
const config = require('./config.json');

// Create a Discord Client
const dc = new Discord.Client();

// Adds new Map ( Discord.Collection extends Map )
dc.cmds = new Discord.Collection();

// Automatically runs once every
(async function registerCommands(dir = 'commands') {
	const files = await fs.readdir(path.join(__dirname, dir));
	console.log(files);

	for (const file of files) {
		const stat = await fs.lstat(path.join(__dirname, dir, file));
		if (stat.isDirectory()) {
			registerCommands(path.join(dir, file));
		}
		else if (file.endsWith('.js')) {
			let cmdName = file.substring(0, file.indexOf('.js'));
			let cmdModule = require(path.join(__dirname, dir, file));
			dc.cmds.set(cmdName, cmdModule);
			console.log(dc.cmds);
		}
	}
})();

// Events


// Ready Event is when it connects to discord and is ready to receive events
dc.once('ready', async () => {
	console.log('Ready!');
	// Send hello to the general channel (The IDS are in config.json)
	dc.channels.cache.get(config.generalId).send('Hello');
});

// This event is fired every time a message is sent
dc.on('message', async (message) => {
	if (message.author.bot) return;
	if (!message.content.startsWith(config.prefix)) return;
	let cmdArgs = message.content.substring(message.content.indexOf(config.prefix) + 2).split(new RegExp(/\s+/));
	console.log(cmdArgs);
	let cmdName = cmdArgs.shift();
	console.log(cmdName);

	if (dc.cmds.get(cmdName)) {
		dc.cmds.get(cmdName).run(dc, message, cmdArgs);
	}
	else {
		message.reply('That command does not exist.');
	}
});

// if a user comes online, the bot will respond 'Hello @user'
/* This may be disabled because it is very annoying This event fires every time a user's status changes */
dc.on('presenceUpdate', async (oldPresence, newPresence) => {
	// If the user was previously offline and now online, this runs
	if (newPresence.status == 'online' && oldPresence.status == 'offline') {
		// Finds the user's username and splits it based on # (Discord shows usernames with their 4 digit id such as @someone#1234/ This removes the number)
		const usr = newPresence.user.tag.split('#');

		// Sets a welcome message. The split command creates an array, so the first element in the array is the username, and the second is the number, which we do not need
		const welmsg = `Welcome ${usr[0]}`;

		// Sends the welcome message in the general channel
		dc.channels.cache.get(config.generalId).send(welmsg, {
			// Sets the reply attribute so it can mention the user
			reply: newPresence.user,
		});
	}
});

// This logs the server into discord using the token (Everything is events, so it can run last)
dc.login(process.env.TOKEN);
