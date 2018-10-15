/**
 * This code is one big mess, until I find a cleaner way to handle commands, it will stay like this.
 */

import {Guild} from "./Guild";
import {Message} from "./Message";
import {Bot} from "./Bot";
import {Watchlist} from "./Watchlist";
import {Whitelist} from "./Whitelist";

export class Commands extends Bot {
	private package = require('../../package.json');
	private config = require('../../config.json');
	protected client: any;

	parse(msg, content) {
		const Discord = require('discord.js');

		if (content.includes(this.config.prefix)) {
			const guild = new Guild();

			const allWordsInMessage = content.split(" ");
			const firstParam = allWordsInMessage[1];
			const secondParam = allWordsInMessage[2];
			const thirdParam = allWordsInMessage[3];
			const senderIsAdmin = guild.userIsAdmin(msg.author.id, msg.channel);

			switch (true) {
				case firstParam === "info":
					let embed = new Discord.RichEmbed()
					.setTitle("Weeaboo Detector (weeabot) version " + this.package.version)
					.setColor(this.config.color)
					.addField("Commands: ", `Use !weeabot commands, to list all commands.`)
					.addField("Your server: ", msg.guild.name)
					.addField("Server ID: ", msg.guild.id)
					.addField("Bugs: ", `Found a bug? Report it [here](https://github.com/jjasspper/Weeaboo-Detector/issues)`)
					.setFooter("© JVH 2018")
					.setThumbnail(this.client.user.avatarURL);
					Message.send({embed}, msg.channel);
					break;
				case firstParam === "commands":
					let commandEmbed = new Discord.RichEmbed()
					.setTitle("All commands:")
					.setColor(this.config.color)
					.addField("Usage", `
						All commands have to be prefixed by: !weeabot. 
						In a command description you can find these "{}" tags. These tags indicate a parameter. 
						When typing a command you should type the parameter without the {}, as these are only an indication of a parameter.
					`)
					.addField("info", `Lists info of this bot`)
					.addField("whitelist add/remove {@user}", `Exludes a server member of being tracked by this bot. All previous stats will remain saved.`)
					.addField("update mutelimit {number}", `Updates the maximum level a server member can have before being muted.`)
					.addField("update kicklimit {number}", `Updates the maximum level a server member can have before being kicked.`)
					.addField("update banlimit {number}", `Updates the maximum level a server member can have before being banned.`)
					.addField("weeblevel {@user}", `Gets the weeblevel of the mentioned server member. Only the first mention will be used.`)
					.setFooter("© JVH 2018")
					.setThumbnail(this.client.user.avatarURL);
					Message.send(commandEmbed, msg.channel);
					break;
				case firstParam === "update":
					if (senderIsAdmin) {
						let level: number = parseInt(thirdParam);
						switch (true) {
							case secondParam === "mutelimit":
								if (level > 0 && level < 999) {
									guild.updateMaxMuteLevel(msg.guild.id, level).then((result: any) => {
										Message.sendApiResponse(result, msg.channel);
									}, (err) => {
										console.log(err);
									});
								} else {
									Message.send("The entered level is invalid. The maximum level is 999", msg.channel);
								}
								break;
							case secondParam === "kicklimit":
								if (level > 0 && level < 999) {
									guild.updateMaxKickLevel(msg.guild.id, level).then((result: any) => {
										Message.sendApiResponse(result, msg.channel);
									}, (err) => {
										console.log(err);
									});
								} else {
									Message.send("The entered level is invalid. The maximum level is 999", msg.channel);
								}
								break;
							case secondParam === "banlimit":
								if (level > 0 && level < 999) {
									guild.updateMaxBanLevel(msg.guild.id, level).then((result: any) => {
										Message.sendApiResponse(result, msg.channel);
									}, (err) => {
										console.log(err);
									});
								} else {
									Message.send("The entered level is invalid. The maximum level is 999", msg.channel);
								}
								break;
							default:
								Message.send("Command not found, use '!weeabot commands' to list all commands.", msg.channel);
								break;
						}
					} else {
						Message.send("Only admins can run this command.", msg.channel);
					}
					break;
				case firstParam === "weeblevel":
					const watchlist = new Watchlist();
					let userID = msg.mentions.users.values().next().value.id;

					watchlist.getUser(msg.guild.id, userID).then((result: string) => {
						let response = JSON.parse(result);
						let data = response.data[0];
						console.log(data);
						if (data) {
							Message.send(`The weeb-level of ${data.user} is ${data.level}`, msg.channel);
						} else {
							Message.send(`The mentioned user has no tracked stats.`, msg.channel);
						}
					}, (err) => {
						console.log(err);
					});
					break;
				case firstParam === "whitelist":
					if (senderIsAdmin) {
						let whiteList = new Whitelist();
						switch (true) {
							case secondParam === "add":
								let userID2 = msg.mentions.users.values().next().value.id;
								whiteList.addUser(msg.guild.id, userID2).then((result) => {
									if (result) {
										Message.sendApiResponse(result, msg.channel);
									}
								});
								break;
							case secondParam === "remove":
								let userID3 = msg.mentions.users.values().next().value.id;
								whiteList.removeUser(msg.guild.id, userID3).then((result) => {
									if (result) {
										Message.sendApiResponse(result, msg.channel);
									}
								});
								break;
						}
					} else {
						Message.send("Only admins can run this command.", msg.channel);
					}
					break;
				case firstParam === "reset" && secondParam === "weeblevel":
					if (senderIsAdmin) {
						let watchlist = new Watchlist();
						watchlist.resetUserLevel(msg.guild.id, msg.mentions.users.values().next().value.id).then((data) => {
							Message.sendApiResponse(data, msg.channel);
						}, (err) => {
							console.log(err);
						})
					}
					break;
				default:
					Message.send("Command not found, use '!weeabot commands' to list all commands.", msg.channel);
					break;
			}

			return;
		}
	}
}