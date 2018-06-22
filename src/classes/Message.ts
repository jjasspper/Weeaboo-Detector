import {Watchlist} from "./Watchlist";

interface Data {
	success: boolean;
	message: string;
	errorCode: null | number;
}

export class Message {
	private message: any;
	private author: any;
	private gluedContent: string;

	constructor(message) {
		this.message = message;
		this.gluedContent = this.message.content.replace(/\s+/g, '');
	}

	static send(content: any, channel: any): void {
		channel.send(content)
	}

	static sendApiResponse(data : Data, channel : any) {
		if (data.success) {
			Message.send(data.message, channel);
		} else {
			const Discord = require("discord.js");
			let embed = new Discord.RichEmbed()
			.setTitle("Oops, an error occured!")
			.setColor(0xff3d3d)
			.addField("Error message:", `${data.message}`)
			.addField("Error code:", `${data.errorCode}`)
			.addField("Please report this error", `To make this bot as solid as possible, I would appreciate it if you could send an error report. 
			Please go to [this](https://github.com/jjasspper/Weeaboo-Detector/issues) link and create a new issue. Inside the issue, include the error message, 
			the error code above and datails of how the error appeared. I will fix the issue as soon as I can. Thanks in advance!`)
			.setFooter("© JVH 2018");

			Message.send({embed}, channel);
		}
	}

	checkForWeeabShit(wordlist: any, whitelist: any): void {
		const watchlist = new Watchlist();
		const sendWordsArray = this.message.content.split(" ");

		// Heavy loop
		mainLoop:
			for (let i = 0; i < sendWordsArray.length; i++) {
				for (let i2 = 0; i2 < wordlist.length; i2++) {
					let blockedWordObj = wordlist[i2];
					let blockedWord: string = blockedWordObj.word;
					let blockedWordLevel: number = blockedWordObj.level;
					let blockedWordLength: number = blockedWord.length;

					let sendWord = sendWordsArray[i];
					let sendWordLength = sendWord.length;

					if (sendWordLength > blockedWordLength) {
						continue mainLoop;
					}

					console.log(`Send word length: ${sendWordLength}, blocked word length: ${blockedWordLength}`);

					// Loop trough whitelist
					for (let i3 = 0; i3 < whitelist.length; i3++) {
						let item = whitelist[i3];
						let listedWord = item.word;

						if (sendWord.includes(listedWord)) {
							continue mainLoop;
						}
					}

					// Check if word contains the blocked word
					if (sendWord.includes(blockedWord) || this.gluedContent.includes(blockedWord)) {
						watchlist.addUser(this.message.guild.id, this.message.author.id, blockedWordLevel, this.message.author.username);
						Message.send(`Possible weeaboo detected. User: <@${this.message.author.id}> has been put on the watchlist!`, this.message.channel);
					}
				}
			}
	}
}