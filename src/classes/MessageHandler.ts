import {Wordlist, WordlistHandler} from "./WordlistHandler";
import {WatchlistHandler} from "./WatchlistHandler";

export class MessageHandler extends WordlistHandler {

    message: any;
    gluedContent: string;

    constructor(message) {
        super();
        this.message = message;
        this.gluedContent = this.message.content.replace(/\s+/g, '');
    }

    checkForWeeabShit() {
        for (let i = 0; i < Object.keys(this.wordlist).length; i++) {
            const watchlist = new WatchlistHandler();

            let blockedWord: Wordlist = this.wordlist[i];
            let word: string = blockedWord.word;
            let level: number = blockedWord.level;

            if (this.message.content.includes(blockedWord) || this.gluedContent.includes(word)) {
                watchlist.addUser(this.message.guild.id, this.message.author.id, level, this.message.author.username);
                //sendMessageToChannel("Possible weeaboo detected. User: " + Message.sender + " has been put on the watchlist!", Message.channel);
            }
        }
    }
}