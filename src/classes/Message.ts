import {Watchlist} from "./Watchlist";

interface Data {
	success: boolean;
	message: string;
	errorCode: null | number;
}

export class Message {
	readonly message: any;
	private author: any;
	private gluedContent: string;

	constructor(message) {
		this.message = message;
		this.gluedContent = this.message.content.replace(/\s+/g, '');
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
	 * Checks if a message contains weeab stuff. Runs every time a chat message is sent.
	 *
	 * @param wordlist
	 * @param whitelist
	 */

	checkForWeebShit(wordlist: any, whitelist: any): void {
		const watchlist = new Watchlist();
		const sendWordsArray = this.message.content.split(" ");

		let finalLevel: number = 0;
		let sendWordsArrayLength = sendWordsArray.length;

		// Heavy loop
		mainLoop:
			while (sendWordsArrayLength--) {

				let wordlistLength = wordlist.length;

				while (wordlistLength--) {
					let blockedWordObj = wordlist[wordlistLength];
					let blockedWord: string = blockedWordObj.word;
					let blockedWordLevel: number = blockedWordObj.level;

					let sendWord: string = sendWordsArray[sendWordsArrayLength];
					let whitelistLength = whitelist.length;

					while (whitelistLength--) {
						let item = whitelist[whitelistLength];
						let listedWord = item.word;

						if (sendWord.length > listedWord.length) {
							continue;
						}

						if (sendWord.includes(listedWord)) {
							continue mainLoop;
						}
					}

					if (sendWord.includes(blockedWord) || this.gluedContent.includes(blockedWord)) {
						finalLevel += blockedWordLevel;
					}
				}

				if (sendWordsArrayLength === 0) {
					if (finalLevel > 0) {
						watchlist.saveUser(this.message.guild.id, this.message.author.id, finalLevel, this.message.author.username).then(() => {
							Watchlist.checkWeeabLevel(this.message.guild.id, this.message.author.id, this.message.channel, finalLevel, this.message);
						}, (err) => {
							Message.send(`Something went wrong. Error: ${err}`, this.message.channel);
						});
					}
					return;
				}
			}
	}
}