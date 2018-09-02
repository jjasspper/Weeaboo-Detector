import {Message} from "./classes/Message";
import {Bot} from "./classes/Bot";
import {Wordlist} from "./classes/Wordlist";
import {Commands} from "./classes/Commands";
import {Whitelist} from "./classes/Whitelist";

/**
 * Loading in npm packages file
 */

require('dotenv').config();
const Discord = require("discord.js");

/**
 * Variables that will store a wordlist
 */

let wordlist;
let whitelist;

/**
 * Loading in classes
 */

const
	client = new Discord.Client(),
	bot = new Bot(client),
	words = new Wordlist(),
	allowed = new Whitelist();

/**
 * Do things when bot is ready
 */

client.on("ready", async () => {
	try {
		console.log('Importing word and whitelist...');
		wordlist = await words.retrieve();
		console.log('Wordlist imported.');
		whitelist = await allowed.retrieve();
		console.log('Whitelist imported.');
		bot.init();
	} catch (e) {
		throw new Error(e);
	}
});

/**
 * Do things when bot joins a server
 */

client.on("guildCreate", guild => {
	guild.addServer(guild.id, guild.name);
	guild.createRole({
		name: "Muted Weeabs",
		color: 0xa400ff,
		permissions: 0x10000,
		mentionable: true
	});
});

/**
 * Do things when a message is send
 */

client.on("message", msg => {
	if (msg.author.equals(client.user)) return;

	const message = new Message(msg);
	const commands = new Commands(client);

	message.checkForWeeabShit(wordlist, whitelist);
	commands.parse(msg, msg.content)
});

/**
 * Do things when user data gets updated
 */

client.on("userUpdate", (oldUser, newUser) => {

});

/**
 * Do things when server data gets updated
 */

client.on("guildUpdate", (oldServer, newServer) => {

});

/**
 * Do things when a mesaage gets updated
 */

client.on("messageUpdate", (oldMessage, newMessage) => {
	const message = new Message(newMessage);
	message.checkForWeeabShit(wordlist, whitelist);
});


/**
 * Logging in to Discord
 */

client.login(process.env.BOT_TOKEN);

