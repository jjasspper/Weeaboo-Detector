import {Api} from "./api/Api";

export interface Wordlist {
    word: string;
    level: number;
}

export class Wordlist extends Api {

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


