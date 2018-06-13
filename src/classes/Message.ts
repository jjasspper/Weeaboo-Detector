import {Watchlist} from "./Watchlist";

export class Message {
	private message: any;
	private author: any;
	private gluedContent: string;

	constructor(message) {
		this.message = message;
		this.gluedContent = this.message.content.replace(/\s+/g, '');
	}

	static sendMessage(content: any, channel: any): void {
		channel.send(content)
	}

	checkForWeeabShit(wordlist, whitelist): void {
		mainLoop:
			for (let i = 0; i < wordlist.length; i++) {
				const watchlist = new Watchlist();

				let blockedWord = wordlist[i];
				let word: string = blockedWord.word;
				let level: number = blockedWord.level;

				for (let i2 = 0; i2 < whitelist.length; i2++) {
					let item = whitelist[i2];
					let listedWord = item.word;

					if (this.message.content.includes(listedWord) || this.gluedContent.includes(listedWord)) {
						continue mainLoop;
					}
				}

				if (this.message.content.includes(blockedWord) || this.gluedContent.includes(word)) {
					watchlist.addUser(this.message.guild.id, this.message.author.id, level, this.message.author.username);
					Message.sendMessage(`Possible weeaboo detected. User: <@${this.message.author.id}> has been put on the watchlist!`, this.message.channel);
				}
			}
	}
}