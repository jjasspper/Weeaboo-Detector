import {Watchlist} from "./Watchlist";

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

	checkForWeeabShit(wordlist: any, whitelist: any): void {
		const watchlist = new Watchlist();
		const sendWordsArray = this.message.content.split(" ");

		primaryLoop:
			for (let i = 0; i < wordlist.length; i++) {

				let blockedWordObj = wordlist[i];
				let blockedWord: string = blockedWordObj.word;
				let blockedWordLevel: number = blockedWordObj.level;

				// Loop trough whitelist
				for (let i2 = 0; i2 < whitelist.length; i2++) {
					let item = whitelist[i2];
					let listedWord = item.word;

					if (this.gluedContent.includes(listedWord)) {
						continue primaryLoop;
					}
				}

				// Check if word contains the blocked word
				if (this.gluedContent.includes(blockedWord)) {
					watchlist.addUser(this.message.guild.id, this.message.author.id, blockedWordLevel, this.message.author.username);
					Message.send(`Possible weeaboo detected. User: <@${this.message.author.id}> has been put on the watchlist!`, this.message.channel);
				}

				if (i == wordlist.length -1) {
					console.log('kanker');
					return;
				}
			}

		// Heavy loop
		secondaryLoop:
			for (let i = 0; i < sendWordsArray.length; i++) {
				for (let i2 = 0; i2 < wordlist.length; i2++) {
					let blockedWordObj = wordlist[i2];
					let blockedWord: string = blockedWordObj.word;
					let blockedWordLevel: number = blockedWordObj.level;
					let blockedWordLength: number = blockedWord.length;

					let sendWord = sendWordsArray[i];
					let sendWordLength = sendWord.length;

					if (sendWordLength > blockedWordLength) {
						continue secondaryLoop;
					}

					console.log(`Send word length: ${sendWordLength}, blocked word length: ${blockedWordLength}`);

					// Loop trough whitelist
					for (let i3 = 0; i3 < whitelist.length; i3++) {
						let item = whitelist[i3];
						let listedWord = item.word;

						if (sendWord.includes(listedWord)) {
							continue secondaryLoop;
						}
					}

					// Check if word contains the blocked word
					if (sendWord.includes(blockedWord)) {
						watchlist.addUser(this.message.guild.id, this.message.author.id, blockedWordLevel, this.message.author.username);
						Message.send(`Possible weeaboo detected. User: <@${this.message.author.id}> has been put on the watchlist!`, this.message.channel);
					}
				}
			}
	}
}