"use strict";

const Discord = require("discord.js");
const Token = "NDIzMTMwNzY1MDkwMzU3MjQ4.DYl9Tw.zq0nmy7R-doyNjQM912PHesKWa4";

let client = new Discord.Client();
let words = [
	'weeab',
	'kawai',
	'desu',
	'nani',
	'arigatou',
	'nya',
	'chan',
	'genji',
	'naruto'
];

client.on("ready", function () {
	console.log("------------------------------------------------------------");
	console.log("Weeaboo Detector enabled, watch your mouth filthy man-childs!");
	console.log("------------------------------------------------------------");
});

client.on("message", function (message) {

	if (message.author.equals(client.user)) return;

	let sender = message.author;
	let content = message.content.toLowerCase();

	console.log(content);

	for (let i = 0; i < words.length; i++) {
		if (content.includes(words[i])) {
			message.channel.send("Mogelijke weeaboo detected. User: " + sender + " is op de watchlist gezet!");
		}
	}

	if (content.includes("p!info") || content.includes("p!pokemon")) {
		setTimeout(function () {
			message.channel.send("Die pokemon is vet cool " + sender + "!");
		}, 1000);
	}

	if (content.includes("fuck")) {
		message.channel.send("Niet schelden " + sender + "!");
	}

	if (content.includes("kanker")) {
		message.channel.send("Niet schelden " + sender + "!");
	}

	if (content.includes("kasper")) {
		message.channel.send(sender + " spoel je mond met zeep, stuk schijt!");
	}

});

client.login(Token);

