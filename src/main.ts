import {Bot} from "./classes/Bot";
import {Wordlist} from "./classes/Wordlist";
import {Whitelist} from "./classes/Whitelist";

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

client.on("ready", () => {
	try {
		console.log('Importing word and whitelist...');
		words.retrieve().then((result) => {
			wordlist = result;
			console.log('Wordlist imported.');

			whitelist = allowed.retrieve().then((result) => {
				whitelist = result;
				console.log('Whitelist imported.');
				require('../dist/events')(client, wordlist, whitelist);
				bot.init();
			}, (err) => {
				console.log("Error whilst getting the wordlist:");
				console.log(err);
			});
		}, (err) => {
			console.log("Error whilst getting the wordlist:");
			console.log(err);
		});
	} catch (e) {
		console.log("Error while booting:");
		console.log(e);
		process.exit();
	}
});

/**
 * Cron jobs
 */

cron.schedule("* * */23 * *", () => {
	wordlist = words.retrieve();
	console.log('Wordlist imported.');
	whitelist = allowed.retrieve();
	console.log('Whitelist imported.');
});

client.login(process.env.BOT_TOKEN);