import {Api} from "./api/Api";

export class Wordlist {

	// Houses the api class
	private api;

	constructor() {
		this.api = new Api();
	}

	/**
	 * Retrieves the wordlist
	 */

	retrieve(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.api.request({
				method: 'GET',
				uri: this.api.apiUri + "/words/all",
			}, (err, response, data) => {
				if (err) {
					reject(process.exit(err));
				} else {
					resolve(JSON.parse(data));
				}
			});
		})
	}
}


