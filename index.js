"use strict";

const appInfo = require("./package");
const Discord = require("discord.js");

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
	'omae',
	'shindeiru'
];

/**
 * Contains bot info
 * @type {{version: string, blockedWords: string[]}}
 */
let info = {
	version: appInfo.version,
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
	client.user.setUsername("Weeabo Detector")

});

client.on("message", message => {

	if (message.author.equals(client.user)) return;

	let sender = message.author;
	let content = message.content.toLowerCase();
	let channel = message.channel;

	console.log(content);

	/**
	 * Logic for the !weeabot command
	 */

	if (content.includes("!weeabot")) {
		let allWordsInMessage = message.content.split(" ");
		let firstParam = allWordsInMessage[1];
		let secondParam = allWordsInMessage[2];

		switch (true) {
			case firstParam === "info":
				sendMessageToChannel("Version: " + appInfo.version, channel);
				break;
			case firstParam === "add":
				if (secondParam === "word") {
					let word = allWordsInMessage[3];
					addTriggerWord(word);
					sendMessageToChannel("Word: '" + word + "' has been added to the list.", channel);
					console.log(blockedWords);
				}
				break;
			case firstParam === "remove":
				if (secondParam === "word") {
					let word = allWordsInMessage[3];
					let index = blockedWords.indexOf(word);

					console.log(word);
					console.log(index);

					if (index === -1) {
						sendMessageToChannel("Word: '" + word + "' not found in the list.", channel);
						console.log(blockedWords);
						break;
					} else {
						console.log(index);
						blockedWords.splice(index, 1);
						sendMessageToChannel("Word: '" + word + "' has been removed from the list.", channel);
						console.log(blockedWords);
						break;
					}
				}
				break;

			default:
				sendMessageToChannel("At your service.", channel);
				break;
		}

		return;
	}

	// Random shit

	if (content.includes("p!info") || content.includes("p!pokemon")) {
		setTimeout(function () {
			message.channel.send("That is one one cool lookin' pokemon " + sender + "!");
		}, 1000);
	}

	if (content.includes("fuck")) {
		sendMessageToChannel("Don't swear " + sender + "!", channel);
	}

	if (content.includes("kanker")) {
		sendMessageToChannel("Dont't swear " + sender + "!", channel);
	}

	if (content.includes("kasper")) {
		sendMessageToChannel(sender + " spoel je mond met zeep, stuk schijt!", channel);
	}

	/**
	 * Checks if a word in the message matches a word in the words object
	 */

	for (let i = 0; i < blockedWords.length; i++) {
		if (content.includes(blockedWords[i])) {
			sendMessageToChannel("Possible weeaboo detected. User: " + sender + " has been put on the watchlist!", channel);
		}
	}

});

client.login(process.env.BOT_TOKEN);

