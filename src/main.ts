import {Message} from "./classes/Message";
import {Bot} from "./classes/Bot";
import {Wordlist} from "./classes/Wordlist";
import {Commands} from "./classes/Commands";
import {Whitelist} from "./classes/Whitelist";
import {GuildHandler} from "./classes/GuildHandler";
import {WatchlistHandler} from "./classes/WatchlistHandler";

/**
 * Loading in npm packages file
 */

require('dotenv').config();
const Discord = require("discord.js");
const cron = require("node-cron");

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
 * Cron jobs
 */

cron.schedule("* * */23 * *", () => {
	console.log("Running task every minute");
	wordlist = words.retrieve();
	console.log('Wordlist imported.');
	whitelist = allowed.retrieve();
	console.log('Whitelist imported.');
});

/**
 * Do things when bot joins a server
 */

client.on("guildCreate", (server) => {
	let guild = new GuildHandler();
	guild.addServer(server.id, server.name);
	server.createRole({
		name: "Weeaboo",
		color: 0xa400ff,
		permissions: 0x400,
		mentionable: true
	}).then((role) => {
		console.log("Registered role:");
		console.log(role);
		guild.registerRole(role.id, server.id);
	});
});

/**
 * Do things when a message is send
 */

client.on("message", (msg) => {
	if (msg.author.equals(client.user)) return;

	const message = new Message(msg);
	const commands = new Commands(client);

	message.parse(wordlist, whitelist);
	commands.parse(msg, msg.content)
});

/**
 * Do things when user data gets updated
 */

client.on("userUpdate", (oldUser, newUser) => {
	let watchlistHandler = new WatchlistHandler();
	watchlistHandler.updateUsername(newUser.id, newUser.username).then((response) => {
		console.log("User update:");
		console.log(response);
	}, (err) => {
		console.log(err);
	})
});

/**
 * Do things when server data gets updated
 */

client.on("guildUpdate", (oldServer, newServer) => {
	let guildHandler = new GuildHandler();
	guildHandler.updateServerName(newServer.id, newServer.name).then((result) => {
		console.log("Guild update:");
		console.log(result);
	}, (err) => {
		console.log(err);
	})
});

/**
 * Do things when a message gets updated
 */

client.on("messageUpdate", (oldMessage, newMessage) => {
	const message = new Message(newMessage);
	message.parse(wordlist, whitelist);
});

/**
 * Logging in to Discord
 */

client.login(process.env.BOT_TOKEN);

