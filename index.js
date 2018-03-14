"use strict";

const appInfo = require("./package");
const Discord = require("discord.js");
const config = require("./config.json");

let client = new Discord.Client();

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
 * Contains bot info
 * @type {{version: string, blockedWords: string[]}}
 */
let info = {
	version: "0.0.1",
	blockedWords: blockedWords
};

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

/**
 * Sends message to current channel
 * @param message
 * @param channel
 */

function sendMessageToChannel(message, channel) {
	channel.send(message);
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
		let allWordsInMessage = message.content.split(" ");
		let firstParam = allWordsInMessage[1];

		switch (true) {
			case firstParam === "info":
				sendMessageToChannel("Version: " + appInfo.version, message.channel);
				break;

			default:
				sendMessageToChannel("At your service.", message.channel);
				break;
		}

		console.log(firstParam);
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

