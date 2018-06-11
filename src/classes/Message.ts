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

	checkForWeeabShit(wordlist): void {
		for (let i = 0; i < wordlist.length; i++) {
			const watchlist = new Watchlist();

			let blockedWord = wordlist[i];
			let word: string = blockedWord.word;
			let level: number = blockedWord.level;

			if (this.message.content.includes(blockedWord) || this.gluedContent.includes(word)) {
				watchlist.addUser(this.message.guild.id, this.message.author.id, level, this.message.author.username);
				Message.sendMessage(`Possible weeaboo detected. User: <@${this.message.author.id}> has been put on the watchlist!`, this.message.channel);
			}
		}
	}
}