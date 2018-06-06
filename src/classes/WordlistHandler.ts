import {ApiHandler} from "./api/ApiHandler";

export interface Wordlist {
    word: string;
    level: number;
}

export class WordlistHandler extends ApiHandler {

    wordlist: Wordlist[];

    getWordlist(): void {
        this.request({
            method: 'GET',
            uri: this.apiUri + "/words/all",
        }, (err, response, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log(data);
                return JSON.parse(data);
            }
        });
    }
}


