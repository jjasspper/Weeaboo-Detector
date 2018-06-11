import {Message} from "./classes/Message";
import {Bot} from "./classes/Bot";
import {Wordlist} from "./classes/Wordlist";
import {Commands} from "./classes/Commands";

/**
 * Loading in npm packages file
 */

require('dotenv').config();
const discord = require("discord.js");

/**
 * Variable that will store a wordlist
 */

let wordlist;

/**
 * Loading in classes
 */

const
	client = new discord.Client(),
	bot = new Bot(client),
	words = new Wordlist();

/**
 * Bot initialisation
 */

client.on("ready", () => {
	bot.init();
	wordlist = words.getWordlist();
});

/**
 * Tasks on guild join
 */

client.on("guildCreate", guild => {
	guild.addServer(guild.id, guild.name);
});

/**
 * Tasks that trigger on message
 */

client.on("message", msg => {
	if (msg.author.equals(client.user)) return;

	const message = new Message(msg);
	const commands = new Commands(client);

	message.checkForWeeabShit(wordlist);
	commands.parse(msg, msg.content)
});

/**
 * Logging in to discord
 */

client.login(process.env.BOT_TOKEN);

