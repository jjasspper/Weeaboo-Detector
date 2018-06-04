export class MessageHandler {
    sender : any;
    content : string;
    gluedContent : string;
    channel : any;
    allWordsInMessage : string[];

    constructor (sender, content, channel) {
        this.sender = sender;
        this.content = content;
        this.channel = channel;
        this.gluedContent = this.content.replace(/\s+/g, '');
        this.allWordsInMessage = this.content.split(" ");
    }

    checkForWeeabShit() {

    }
}