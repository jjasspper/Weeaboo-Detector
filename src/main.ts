"use strict";

const
	Discord:any = require("discord.js"),
	apiUri:any = process.env.API,
	appInfo:any = require("../package"),
	botColor:any = 0xae29fe,
	request:any = require("request"),
	client:any = new Discord.Client();

/**
 * Variable containing blocked words
 */

let blockedWords: object;

/**
 * Contains bot info
 * @type {{version: string, blockedWords: string[]}}
 */

let info: object = {
	version: appInfo.version,
};

/**
 * Sends a message to the defined channel
 * @param message
 * @param channel
 */

function sendMessageToChannel(message, channel):void {
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
			"serverID": guild.id.toString(),
			"serverName": guild.name.toString()
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
						"serverID": message.guild.id.toString(),
						"serverName": message.guild.name.toString(),
					}
				}, (err, response, data) => {
					if (err) {
						console.log(err);
					} else {
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

	for (let i = 0; i < Object.keys(blockedWords).length; i++) {
		let blockedWordObj = blockedWords[i];
		let blockedWord = blockedWordObj.word;
		let blockedWordLevel = blockedWordObj.level;

		if (content.includes(blockedWord) || gluedContent.includes(blockedWord)) {
			request({
				method: 'POST',
				uri: apiUri + "/watchlist/users/add",
				json: true,
				body: {
					"serverID": message.guild.id.toString(),
					"userID": message.author.id.toString(),
					"level": blockedWordLevel,
					"userName": message.author.username
				}
			}, (err, response, data) => {
				if (err) {
					console.log(err);
				} else {
					console.log(message.guild.name);
					console.log(data.success);
				}
			});
			sendMessageToChannel("Possible weeaboo detected. User: " + sender + " has been put on the watchlist!", channel);
		}
	}

});

client.login(process.env.BOT_TOKEN);

