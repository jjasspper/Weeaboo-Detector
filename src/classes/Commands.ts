import {Guild} from "./Guild";
import {Message} from "./Message";

export class Commands {
	private package = require('../../package.json');
	private config = require('../../config.json');
	private client: any;

	constructor (client) {
		this.client = client;
	}

	parse(msg, content) {
		const discord = require("discord.js");

		if (content.includes(this.config.prefix)) {
			let allWordsInMessage = content.split(" ");
			let firstParam = allWordsInMessage[1];

			switch (true) {
				case firstParam === "info":
					let embed = new discord.RichEmbed()
					.setTitle("Weeaboo Detector (weeabot) version " + this.package.version)
					.setColor(this.config.color)
					.addField("Commands: ", "- !weeabot info: lists info of this bot.")
					.addField("Your server: ", msg.guild.name)
					.addField("Server ID: ", msg.guild.id)
					.setFooter("© JVH 2018")
					.setThumbnail(this.client.user.avatarURL);
					Message.sendMessage({embed}, msg.channel);
					break;
				case firstParam === "serverid":
					console.log(msg.guild.id);
					break;
				case firstParam === "register":
					const guild = new Guild();
					guild.addServer(msg.guild.id, msg.guild.name);
					break;
				default:
					Message.sendMessage("Command not found, use '!weeabot info' to list all commands.", msg.channel);
					break;
			}

			return;
		}
	}
}