"use strict";

require('dotenv').config();

const botColor = 0xae29fe,
	appInfo = require("./package"),
	Discord = require("discord.js"),
	http = require("http");

let client = new Discord.Client();

/**
 * Array containing blocked words
 * @type {string[]}
 */

let blockedWords;

/**
 * Contains bot info
 * @type {{version: string, blockedWords: string[]}}
 */

let info = {
	version: appInfo.version,
};

/**
 * Sends a message to the defined channel
 * @param message
 * @param channel
 */

function sendMessageToChannel(message, channel) {
	channel.send(message);
}

client.on("ready", () => {
	http.get("http://dev.api.jaspervanhienen.com/words/all", (response) => {
		let data = '';

		response.on("data", (chunk) => {
			data += chunk;
		});

		response.on('end', () => {
			console.log(JSON.parse(data));
			blockedWords = JSON.parse(data);

			console.log("--------------------------------------------------------------");
			console.log("Weeaboo Detector enabled, watch your mouth filthy man-childs!");
			console.log("--------------------------------------------------------------");

			client.user.setActivity("on weeabs");
			client.user.setUsername("Weeabo Detector")
		});

	}).on("error", (err) => {
		console.log("Error: " + err.message);
	});
});

client.on("guildCreate", guild => {
	http.get("http://dev.api.jaspervanhienen.com/servers/add/" + guild.id + "/" + guild.name, (response) => {
		let data = '';

		response.on("data", (chunk) => {
			data += chunk;
		});

		response.on('end', () => {
			console.log(JSON.parse(data));
		});

		response.on('error', (err) => {

		});
	}).on("error", (err) => {
		console.log("Error: " + err.message);
	});
});

client.on("message", message => {

	if (message.author.equals(client.user)) return;

	let sender = message.author;
	let content = message.content.toLowerCase();
	let gluedContent = content.replace(/\s/g, '');
	let channel = message.channel;

	/**
	 * Logic for the !weeabot command
	 */

	if (content.includes("!weeabot")) {
		let allWordsInMessage = message.content.split(" ");
		let firstParam = allWordsInMessage[1];
		let secondParam = allWordsInMessage[2];

		switch (true) {
			case firstParam === "info":
				let embed = new Discord.RichEmbed()
					.setTitle("Weeaboo Detector (weeabot) version " + appInfo.version)
					.setColor(botColor)
					.addField("Commands: ", "- !weeabot info: lists info of this bot.")
					.addField("Your server: ", message.guild.name)
					.addField("Server ID: ", message.guild.id)
					.setFooter("© JVH 2018")
					.setThumbnail(client.user.avatarURL);
				sendMessageToChannel({embed}, channel);
				break;
			case firstParam === "serverid":
				console.log(message.guild.id);
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
				break;
			case firstParam === "register":
				http.get("http://dev.api.jaspervanhienen.com/servers/add/" + message.guild.id + "/" + message.guild.name, (response) => {
					let data = '';

					response.on("data", (chunk) => {
						data += chunk;
					});

					response.on('end', () => {
						console.log(JSON.parse(data));
					});

					response.on('error', (err) => {

					});
				}).on("error", (err) => {
					console.log("Error: " + err.message);
				});
				break;
			default:
				sendMessageToChannel("Command not found, use '!weeabot info' to list all commands.", channel);
				break;
		}

		return;
	}

	// Random shit

	if (content.includes("p!pokemon")) {
		setTimeout(function () {
			message.channel.send("That is one one cool lookin' pokemon " + sender + "!");
		}, 1000);
	}

	/**
	 * Checks if a word in the message matches a word in the words object
	 */

	for (let i = 0; i < blockedWords.length; i++) {
		let blockedWordObj = blockedWords[i];
		let blockedWord = blockedWordObj.word;

		if (content.includes(blockedWord) || gluedContent.includes(blockedWord)) {
			sendMessageToChannel("Possible weeaboo detected. User: " + sender + " has been put on the watchlist!", channel);
		}
	}

});

client.login(process.env.BOT_TOKEN);

