import {Api} from "./api/Api";

export interface WordTemplate {
	word: string;
	level: number;
}

export class Wordlist extends Api {

	wordlist: WordTemplate[];

	getWordlist(): void {
		this.request({
			method: 'GET',
			uri: this.apiUri + "/words/all",
		}, (err, response, data) => {
			if (err) {
				console.log(err);
			} else {
				this.wordlist = JSON.parse(data);
				return this.wordlist;
			}
		});
	}
}


