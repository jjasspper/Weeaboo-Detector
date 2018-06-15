import {Api} from "./api/Api";

export class Wordlist {

	private api;

	constructor() {
		this.api = new Api();
	}

	retrieve(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.api.request({
				method: 'GET',
				uri: this.api.apiUri + "/words/all",
			}, (err, response, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(JSON.parse(data));
				}
			});
		})
	}
}


