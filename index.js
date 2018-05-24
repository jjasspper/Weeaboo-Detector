"use strict";

const
	Config = require('dotenv').config(),
	Discord = require("discord.js"),
	apiUri = Config.parsed.API,
	appInfo = require("./package"),
	botColor = 0xae29fe,
	request = require("request");

let client = new Discord.Client();

/**
 * Variable containing blocked words
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

/**
 * Logic for when the boot has booted.
 */

client.on("ready", () => {
	request({
		method: 'GET',
		uri: apiUri + "/words/all",
	}, (err, response, data) => {
		if (err) {
			console.log(err);
		} else {
			blockedWords = JSON.parse(data);
			console.log(blockedWords);
		}
	});

	console.log("--------------------------------------------------------------");
	console.log("Weeaboo Detector enabled, watch your mouth filthy man-childs!");
	console.log("--------------------------------------------------------------");

	client.user.setActivity("on weeabs");
	client.user.setUsername("Weeabo Detector");
});

/**
 * Logic for when the bot joins a server
 */

client.on("guildCreate", guild => {
	request({
		method: 'POST',
		uri: apiUri + "/servers/add",
		json: true,
		body: {
			"serverID": parseInt(guild.id),
			"serverName": guild.name
		}
	}, (err, response, data) => {
		if (err) {
			console.log(err);
		} else {
			console.log(guild.name);
			console.log(data);
		}
	});
});

/**
 * Logic for send messages
 */

client.on("message", message => {

	if (message.author.equals(client.user)) return;

	let sender = message.author;
	let content = message.content.toLowerCase();
	let gluedContent = content.replace(/\s+/g, '');
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
			case firstParam === "register":
				request({
					method: 'POST',
					uri: apiUri + "/servers/add",
					json: true,
					body: {
						"serverID": parseInt(message.guild.id),
						"serverName": message.guild.name
					}
				}, (err, response, data) => {
					if (err) {
						console.log(err);
					} else {
						console.log(message.guild.name);
						console.log(data);
					}
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

