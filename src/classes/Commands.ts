/**
 * This code is one big mess, until I find a cleaner way to handle commands, it will stay like this.
 */

import {Guild} from "./Guild";
import {Message} from "./Message";
import {Bot} from "./Bot";
import {Watchlist} from "./Watchlist";
import {Whitelist} from "./Whitelist";
import {IWatchlistData} from "../interfaces/IWatchlistData";

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
					.addField("Commands: ", `Use !weeabot commands, to list all commands.`)
					.addField("Your server: ", msg.guild.name)
					.addField("Server ID: ", msg.guild.id)
					.addField("Bugs: ", `Found a bug? Report it [here](https://github.com/jjasspper/Weeaboo-Detector/issues)`)
					.setFooter("© JVH 2018")
					.setThumbnail(this.client.user.avatarURL);
					Message.send({embed}, msg.channel);
					break;
				case firstParam === "getThisServerLevel":
					guild.getServerLevels(msg.guild.id).then((result) => {
						console.log(result);
					});
					break;
				case firstParam === "serverid":
					console.log(msg.guild.id);
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
					.addField("whitelist add {@user}", `Exludes a server member of being tracked by this bot. All previous stats will remain saved.`)
					.addField("update mutelevel {number}", `Updates the maximum level a server member can have before being muted.`)
					.addField("update kicklevel {number}", `Updates the maximum level a server member can have before being kicked.`)
					.addField("update banlevel {number}", `Updates the maximum level a server member can have before being banned.`)
					.addField("weeablevel {@user}", `Gets the weeablevel of the mentioned server member. Only the first mention will be used.`)
					.setFooter("© JVH 2018")
					.setThumbnail(this.client.user.avatarURL);
					Message.send(commandEmbed, msg.channel);
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
								Message.send("The entered level is invalid. The maximum level is 999", msg.channel);
							}
							break;
						case secondParam === "kicklevel":
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
						case secondParam === "banlevel":
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
					break;
				case firstParam === "register":
					guild.addServer(msg.guild.id, msg.guild.name);
					break;
				case firstParam === "weeablevel":
					const watchlist = new Watchlist();
					let userID = msg.mentions.users.values().next().value.id;

					watchlist.getUser(msg.guild.id, userID).then((result: string) => {
						let response = JSON.parse(result);
						let data = response.data[0];
						console.log(data);
						if (data) {
							Message.send(`The weeab-level of ${data.user} is ${data.level}`, msg.channel);
						} else {
							Message.send(`The mentioned user has no tracked stats.`, msg.channel);
						}
					}, (err) => {
						console.log(err);
					});
					break;
				case firstParam === "whitelist":
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
					break;
				case firstParam === "crole":
					msg.guild.createRole({
						name: "Muted Weeabs",
						color: 0xa400ff,
						permissions: 0x10000,
						mentionable: true
					}).then((role) => {
						let guild = new Guild();
						guild.registerRole(role.id, msg.guild.id).then((response) => {
							console.log(response);
							console.log(role.id);
							Message.sendApiResponse(response, msg.channel);
						});
					}, (exception) => {
						console.log(exception);
					});
					break;
				default:
					Message.send("Command not found, use '!weeabot commands' to list all commands.", msg.channel);
					break;
			}

			return;
		}
	}
}