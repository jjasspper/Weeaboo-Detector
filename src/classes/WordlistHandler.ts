import {Wordlist} from "../interfaces/Wordlist";
import {Api} from "../interfaces/Api";

export class WordlistHandler implements Wordlist, Api{

    wordlist : object;
    apiUri : string;
    request : any;

    getWordlist () {
        this.request({
            method: 'GET',
            uri: this.apiUri + "/words/all",
        }, (err, response, data) => {
            if (err) {
                console.log(err);
            } else {
                this.wordlist = JSON.parse(data);
                console.log(this.wordlist);
            }
        });
    }
}


