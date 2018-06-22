import {Guild} from "./Guild";
import {Message} from "./Message";
import {Bot} from "./Bot";

export class Commands extends Bot {
	private package = require('../../package.json');
	private config = require('../../config.json');
	protected client: any;

	parse(msg, content) {
		const Discord = require('discord.js');

		if (content.includes(this.config.prefix)) {
			const guild = new Guild();

			let allWordsInMessage = content.split(" ");
			let firstParam = allWordsInMessage[1];
			let secondParam = allWordsInMessage[2];
			let thirdParam = allWordsInMessage[3];

			switch (true) {
				case firstParam === "info":
					let embed = new Discord.RichEmbed()
					.setTitle("Weeaboo Detector (weeabot) version " + this.package.version)
					.setColor(this.config.color)
					.addField("Commands: ", "- !weeabot info: lists info of this bot.")
					.addField("Your server: ", msg.guild.name)
					.addField("Server ID: ", msg.guild.id)
					.addField("Bugs: ", `Found a bug? Report it [here](https://github.com/jjasspper/Weeaboo-Detector/issues)`)
					.setFooter("© JVH 2018")
					.setThumbnail(this.client.user.avatarURL);
					Message.send({embed}, msg.channel);
					break;
				case firstParam === "serverid":
					console.log(msg.guild.id);
					break;
				case firstParam === "update":
					let level: number = parseInt(thirdParam);

					switch (true) {
						case secondParam === "mutelevel":
							if (level > 0 && level < 999) {
								guild.updateMaxMuteLevel(msg.guild.id, level).then((result: any) => {
									Message.sendApiResponse(result, msg.channel);
								}, (err) => {
									console.log(err);
								});
							} else {
								Message.send("Level is outside of the limit (not the manga) please try another level.", msg.channel);
							}
							break;
						case secondParam === "kicklevel":
							if (level > 0 && level < 999) {
								guild.updateMaxBanLevel(msg.guild.id, level).then((result: any) => {
									Message.sendApiResponse(result, msg.channel);
								}, (err) => {
									console.log(err);
								});
							} else {
								Message.send("Level is outside of the limit (not the manga) please try another level.", msg.channel);
							}
							break;
						case secondParam === "banlevel":
							if (level > 0 && level < 999) {
								guild.updateMaxBanLevel(msg.guild.id, level).then((result: any) => {
									Message.sendApiResponse(result, msg.channel);
								}, (err) => {
									console.log(err);
								});
							} else {
								Message.send("Level is outside of the limit (not the manga) please try another level.", msg.channel);
							}
							break;
						default:
							Message.send("Command not found, use '!weeabot info' to list all commands.", msg.channel);
							break;
					}
					break;
				case firstParam === "register":
					guild.addServer(msg.guild.id, msg.guild.name);
					break;
				default:
					Message.send("Command not found, use '!weeabot info' to list all commands.", msg.channel);
					break;
			}

			return;
		}
	}
}