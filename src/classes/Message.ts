import {WatchlistHandler} from "./WatchlistHandler";

export class Message {
	readonly message: any;
	private author: any;
	private gluedContent: string;

	constructor(message) {
		this.message = message;
		this.gluedContent = Message.stripWord(this.message.content.replace(/\s+/g, ''));
	}

	/**
	 * Sends a message to a channel
	 *
	 * @param content
	 * @param channel
	 */

	static send(content: any, channel: any): void {
		channel.send(content)
	}

	/**
	 * Sends a messaged based on a parsed API response
	 *
	 * @param data
	 * @param channel
	 */

	static sendApiResponse(data, channel: any) {
		if (data.success) {
			Message.send(data.message, channel);
		} else {
			const Discord = require("discord.js");
			let embed = new Discord.RichEmbed()
			.setTitle("Oops, an error occured!")
			.setColor(0xff3d3d)
			.addField("Error message:", `${data.message}`)
			.addField("Error code:", `${data.errorCode}`)
			.addField("Not you fault? Please report this error!",
				`To make this bot as solid as possible, I would appreciate it if you could send an error report. Please go to [this](https://github.com/jjasspper/Weeaboo-Detector/issues) link and create a new issue. Inside the issue, include the error message, the error code above and details of how the error appeared. I will fix the issue as soon as I can. Thanks in advance!`)
			.setFooter("© JVH 2018");

			Message.send({embed}, channel);
		}
	}

	/**
	 * Removes all duplicate letters from a string
	 *
	 * @param str
	 */

	static stripWord(str) {
		let result = "";

		for (let i = 0; i < str.length; i++) {
			result = result + str[i];
			while (i < str.length + 2 && str[i] == str[i + 1]) {
				i++;
			}
		}
		return result;
	}

	/**
	 * Checks if a message contains weeab stuff. Runs every time a chat message is sent.
	 *
	 * @param wordlist
	 * @param whitelist
	 */

	parse(wordlist: any, whitelist: any): void {
		const watchlist = new WatchlistHandler();
		const sendWordsArray = this.message.content.split(" ");
		let sendWordsArrayLength = sendWordsArray.length;
		let finalLevel: number = 0;

		// Heavy loop
		mainLoop:
			while (sendWordsArrayLength--) {
				let wordlistIndex = wordlist.length;
				let saidBlockedWords = [];

				while (wordlistIndex--) {
					let blockedWordObj = wordlist[wordlistIndex];
					let blockedWord: string = blockedWordObj.word;
					let blockedWordLevel: number = blockedWordObj.level;

					let sendWord: string = sendWordsArray[sendWordsArrayLength];
					let strippedWord: string = Message.stripWord(sendWordsArray[sendWordsArrayLength]);
					let whitelistLength = whitelist.length;

					while (whitelistLength--) {
						let item = whitelist[whitelistLength];
						let listedWord = item.word;

						if (sendWord.length > listedWord.length || strippedWord.length > listedWord.length) {
							continue;
						}

						if (sendWord.includes(listedWord) || strippedWord.includes(listedWord)) {
							continue mainLoop;
						}
					}

					if (sendWord.includes(blockedWord) || this.gluedContent.includes(blockedWord) || strippedWord.includes(blockedWord)) {
						finalLevel += blockedWordLevel;
						saidBlockedWords.push(blockedWord)
					}
				}

				if (sendWordsArrayLength === 0) {
					if (finalLevel > 0) {
						watchlist.saveUser(this.message.guild.id, this.message.author.id, finalLevel, this.message.author.username).then(() => {
							WatchlistHandler.handleUser(this.message.guild.id, this.message.author.id, saidBlockedWords.join(', '), finalLevel, this.message);
						}, (err) => {
							Message.send(`Something went wrong. Error: ${err}`, this.message.channel);
						});
					}
					return;
				}
			}
	}
}