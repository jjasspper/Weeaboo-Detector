import {Api} from "./api/Api";

export class Whitelist {

	private whitelist;

	constructor() {
		const api = new Api();

		api.request({
			method: 'GET',
			uri: api.apiUri + "/whitelist/all",
		}, (err, response, data) => {
			if (err) {
				console.log(err);
			} else {
				this.whitelist = JSON.parse(data);
			}
		});
	}

	getWhitelist() {
		return this.whitelist;
	}
}