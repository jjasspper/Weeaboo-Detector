import {Api} from "./api/Api";

export class Wordlist {

	public wordlist;

	constructor() {
		const api = new Api();

		api.request({
			method: 'GET',
			uri: api.apiUri + "/words/all",
		}, (err, response, data) => {
			if (err) {
				console.log(err);
			} else {
				this.wordlist = JSON.parse(data);
			}
		});
	}

	getWordlist() {
		return this.wordlist;
	}
}


