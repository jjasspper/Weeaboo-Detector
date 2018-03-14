"use strict";

const Discord = require("discord.js");
const config = require("./config.json");

let client = new Discord.Client();

/**
 * Contains bot info
 * @type {{version: string, blockedWords: *}}
 */
let info = {
	version: "0.0.1",
	blockedWords: this.words
};

/**
 * Array containing blocked words
 * @type {string[]}
 */
let blockedWords = [
	'kawai',
	'desu',
	'nani',
	'arigatou',
	'nya',
	'chan',
	'genji',
	'naruto',
];

/**
 * Object containing watched users
 * @type {{users: Array}}
 */
let watchList = {
	users: [],
};

/**
 * Adds a trigger word to the words list
 * @param word
 */

function addTriggerWord(word) {
	blockedWords.push(word);
}

client.on("ready", () => {
	console.log("--------------------------------------------------------------");
	console.log("Weeaboo Detector enabled, watch your mouth filthy man-childs!");
	console.log("--------------------------------------------------------------");
	client.user.setActivity("on weeabs");
});

client.on("message", message => {

	if (message.author.equals(client.user)) return;

	let sender = message.author;
	let content = message.content.toLowerCase();

	console.log(content);

	/**
	 * Checks if a word in the message matches a word in the words object
	 */

	for (let i = 0; i < blockedWords.length; i++) {
		if (content.includes(blockedWords[i])) {
			message.channel.send("Possible weeaboo detected. User: " + sender + " has been put on the watchlist!");
		}
	}

	/**
	 * Logic for the !weeabot command
	 */

	if (content.includes("!weeabot")) {
		message.channel.send("At your service.");
	}

	// Random shit

	if (content.includes("p!info") || content.includes("p!pokemon")) {
		setTimeout(function () {
			message.channel.send("That is one one cool lookin' pokemon " + sender + "!");
		}, 1000);
	}

	if (content.includes("fuck")) {
		message.channel.send("Don't swear " + sender + "!");
	}

	if (content.includes("kanker")) {
		message.channel.send("Dont't swear " + sender + "!");
	}

	if (content.includes("kasper")) {
		message.channel.send(sender + " spoel je mond met zeep, stuk schijt!");
	}

});

client.login(config.token);

