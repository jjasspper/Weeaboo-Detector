import {Api} from "./api/Api";

export class Whitelist {

	private api;

	constructor() {
		this.api = new Api();
	}

	retrieve() {
		return new Promise((resolve, reject) => {
			this.api.request({
				method: 'GET',
				uri: this.api.apiUri + "/whitelist/all",
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