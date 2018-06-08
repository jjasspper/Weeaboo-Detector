import {Wordlist} from "./Wordlist";
import {Watchlist} from "./Watchlist";

export class Message extends Wordlist {

    message: any;
    gluedContent: string;

    constructor(message) {
        super();
        this.message = message;
        this.gluedContent = this.message.content.replace(/\s+/g, '');
    }

    static sendMessage(content: string, channel: any): void {
        channel.send(content)
    }

    checkForWeeabShit(wordlist): any {
        console.log(wordlist);
        return;

        for (let i = 0; i < wordlist.length; i++) {
            const watchlist = new Watchlist();

            let blockedWord: Wordlist = this.wordlist[i];
            let word: string = blockedWord.word;
            let level: number = blockedWord.level;

            if (this.message.content.includes(blockedWord) || this.gluedContent.includes(word)) {
                watchlist.addUser(this.message.guild.id, this.message.author.id, level, this.message.author.username);
                Message.sendMessage("Possible weeaboo detected. User: " + this.message.sender + " has been put on the watchlist!", this.message.channel);
            }
        }
    }
}